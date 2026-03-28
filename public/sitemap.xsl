<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap — REEF Luxury Developments</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0fafa; color: #222; }
          header { background: #40C2CC; color: #fff; padding: 24px 40px; display: flex; align-items: center; gap: 16px; }
          header h1 { font-size: 20px; font-weight: 600; letter-spacing: 0.02em; }
          header span { font-size: 13px; color: rgba(255,255,255,0.75); margin-left: auto; }
          main { max-width: 900px; margin: 40px auto; padding: 0 20px; }
          table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
          thead { background: #2a9aa3; color: #fff; }
          th { padding: 14px 20px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
          td { padding: 14px 20px; font-size: 14px; border-bottom: 1px solid #e8f7f8; }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: #f0fafa; }
          a { color: #40C2CC; text-decoration: none; font-weight: 500; }
          a:hover { text-decoration: underline; color: #2a9aa3; }
          .count { color: #555; font-size: 13px; margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <header>
          <h1>REEF Luxury Developments — Sitemap</h1>
          <span><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs</span>
        </header>
        <main>
          <p class="count">
            <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> pages indexed
          </p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
