# 192x192 (Auth Screen)

magick logo.png -resize 192x192 -fuzz 5% -transparent white public/brand/logo-192.png

# 80x80 (Expanded Sidebar)

magick logo.png -resize 80x80 -fuzz 5% -transparent white public/brand/logo-80.png

# 64x64 (Collapsed Sidebar)

magick logo.png -resize 64x64 -fuzz 5% -transparent white public/brand/logo-64.png

magick logo.png -define icon:auto-resize=48,32,16 public/favicon.ico


Instead of manually editing 149 buttons or fighting with GritQL, run this Bun-native Perl command. It's multiline-safe and won't touch buttons that already have a type attribute:
bash

# Dry run first — count how many buttons would change

find src -name '_.tsx' -print0 | xargs -0 perl -0ne 'print "$ARGV\n" if /<button\b(?![^>]_\btype=)/s'

# Apply the fix

find src -name '_.tsx' -print0 | xargs -0 perl -i -0pe '
  s/<button\b(?![^>]_\btype=)/<button type="button"/g
'


find src -name '*.tsx' -print0 | xargs -0 perl -i -0pe '
# Collapse consecutive `type='button'`/`type="button"` (allow whitespace/newlines between)

s/(type=([\x27"])button\2\s*)+/type="button"\n /g;'


find src -name '_.tsx' -print0 | xargs -0 perl -0ne '
  print "$ARGV\n" if /(type=[\x27"]button[\x27"][\s\S]_?){2,}?<\//;
'
