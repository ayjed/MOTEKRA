with open('MOTEKRA_PHASE_TRACKER.md', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(' lign-items', ' `align-items`')

with open('MOTEKRA_PHASE_TRACKER.md', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done fixing align-items.')
