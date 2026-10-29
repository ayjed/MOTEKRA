with open("src/app/team/[slug]/page.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(
    '      <div className="container">\n        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: person.name, path: `/team/${person.slug}` }]} />\n      </div>\n',
    ''
).replace(
    '      <div className="container">\r\n        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: person.name, path: `/team/${person.slug}` }]} />\r\n      </div>\r\n',
    ''
)

with open("src/app/team/[slug]/page.tsx", "w", encoding="utf-8") as f:
    f.write(text)

with open("src/components/about/founder-page.tsx", "r", encoding="utf-8") as f:
    fp = f.read()

if 'import { Breadcrumbs } from "@/components/seo/breadcrumbs";' not in fp:
    fp = 'import { Breadcrumbs } from "@/components/seo/breadcrumbs";\n' + fp
    fp = fp.replace(
        '<section className="editorial-hero founder-hero"><div className="container editorial-hero-grid"><div>',
        '<section className="editorial-hero founder-hero"><div className="container editorial-hero-grid"><div><Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: person.name, path: `/team/${person.slug}` }]} />'
    )

with open("src/components/about/founder-page.tsx", "w", encoding="utf-8") as f:
    f.write(fp)

print("Updated founder page and route successfully!")

