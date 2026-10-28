with open("src/components/services/services-page.tsx", "r", encoding="utf-8") as f:
    text = f.read().replace("\r\n", "\n")

old_scope = """            <h2>
              A connected approach.<br />
              <span>A clear agreement.</span>
            </h2>"""

new_scope = """            <h2 aria-label="A connected approach. A clear agreement.">
              <span className="services-title-mask" aria-hidden="true">
                <span data-services-heading-line>A connected approach.</span>
              </span>
              <span className="services-title-mask" aria-hidden="true">
                <span data-services-heading-line>A clear agreement.</span>
              </span>
            </h2>"""

assert old_scope in text, "old_scope not found in services-page.tsx"
text = text.replace(old_scope, new_scope)

with open("src/components/services/services-page.tsx", "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

print("Updated services-page.tsx successfully!")

