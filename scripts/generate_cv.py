"""Rebuild the downloadable CV from data.json (requires reportlab)."""
import json
from pathlib import Path
from xml.sax.saxutils import escape

import reportlab
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether, PageBreak

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'data.json').read_text())
site, cv = data['site'], data['cv']
output = ROOT / 'assets/documents/nelly-perkins-cv.pdf'
output.parent.mkdir(parents=True, exist_ok=True)
fonts = Path(reportlab.__file__).parent / 'fonts'
pdfmetrics.registerFont(TTFont('CVSans', str(fonts / 'Vera.ttf')))
pdfmetrics.registerFont(TTFont('CVSans-Bold', str(fonts / 'VeraBd.ttf')))
styles = getSampleStyleSheet()
for name, size, leading, color, after in [
    ('Name', 27, 31, '#1f242b', 8),
    ('Role', 11, 15, '#32363d', 8),
    ('Section', 14, 18, '#1f242b', 10),
    ('Item', 11, 15, '#1f242b', 4),
    ('Meta', 9, 13, '#32363d', 6),
    ('Copy', 9, 12, '#32363d', 6),
    ('Detail', 9, 12, '#32363d', 3),
]:
    styles.add(ParagraphStyle(name=name, fontName='CVSans-Bold' if name in ('Name', 'Section', 'Item') else 'CVSans', fontSize=size, leading=leading, textColor=colors.HexColor(color), spaceAfter=after, alignment=TA_LEFT, keepWithNext=name in ('Section', 'Item', 'Meta')))
styles['Detail'].leftIndent = 10
styles['Detail'].bulletIndent = 0
story = []
def p(text, style='Copy'):
    return Paragraph(escape(text), styles[style])
def section(title):
    story.extend([Spacer(1, 6), p(title, 'Section')])

story.extend([p(site['name'], 'Name'), p(site['role'], 'Role'),
              p(f"{site['email']} | {site['location']} | {site['github'].replace('https://', '')}", 'Meta'),
              p(cv['intro'])])
section('Profile')
for text in cv['profile']:
    story.append(p(text))
section('Work Experience')
for item in cv['experience']:
    block = [p(item['role'], 'Item'), p(f"{item['company']} | {item['dates']}", 'Meta')]
    block.extend(Paragraph(escape(text), styles['Detail'], bulletText='-') for text in item['details'])
    block.append(Spacer(1, 4))
    story.append(KeepTogether(block))

story.append(PageBreak())
story.extend([p(site['name'], 'Name'), p('Education, certification & skills', 'Role')])
section('Education')
for item in cv['education']:
    story.append(KeepTogether([p(item['degree'], 'Item'), p(f"{item['school']} | {item['location']} | {item['dates']}", 'Copy'), Spacer(1, 6)]))
section('Certification')
for item in cv['certifications']:
    story.append(KeepTogether([p(item['name'], 'Item'), p(f"{item['issuer']} | {item['date']}", 'Copy'), Spacer(1, 6)]))
section('Skills & Tools')
story.append(p(' | '.join(data['skills'])))

def page_footer(canvas, doc):
    canvas.setStrokeColor(colors.HexColor('#fbcd6d'))
    canvas.setLineWidth(2)
    canvas.line(18*mm, 18*mm, A4[0]-18*mm, 18*mm)
    canvas.setFont('CVSans', 8)
    canvas.setFillColor(colors.HexColor('#32363d'))
    canvas.drawString(18*mm, 12*mm, site['name'] + ' | Curriculum vitae')
    canvas.drawRightString(A4[0]-18*mm, 12*mm, str(doc.page))

SimpleDocTemplate(str(output), pagesize=A4, rightMargin=18*mm, leftMargin=18*mm,
                  topMargin=16*mm, bottomMargin=23*mm, title=site['name']+' - CV', author=site['name']).build(story, onFirstPage=page_footer, onLaterPages=page_footer)
print(output)
