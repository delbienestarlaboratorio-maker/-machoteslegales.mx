import os, glob
base = r'src\data\templates\v2'
lines = []
for f in sorted(glob.glob(os.path.join(base, '**', '*.html'), recursive=True)):
    with open(f, encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    size = round(os.path.getsize(f)/1024, 1)
    rel = f.replace(base + os.sep, '').replace(os.sep, '/')
    hv2 = 'header-v2' in content
    badge = 'tier-badge' in content
    jinja = '{%' in content
    footer = 'confidencialidad-v2' in content
    lines.append(f'{size:5.1f}KB | hv2={str(hv2):5} badge={str(badge):5} jinja={str(jinja):5} footer={str(footer):5} | {rel}')

with open('audit_v2.txt','w',encoding='utf-8') as fp:
    fp.write('\n'.join(lines))
print('\n'.join(lines))
