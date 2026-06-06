import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  const width = searchParams.get('width')
  const height = searchParams.get('height')
  const type = searchParams.get('type')

  if (!key) {
    return new NextResponse('Missing key parameter', { status: 400 })
  }

  let html = ''

  if (type === 'native') {
    html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            html, body { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; background: transparent; }
            #container-${key} { width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          <div id="container-${key}"></div>
          <script type="text/javascript" data-cfasync="false" src="https://pl29644580.effectivecpmnetwork.com/${key}/invoke.js"></script>
        </body>
      </html>
    `
  } else {
    if (!width || !height) {
      return new NextResponse('Missing width or height parameters', { status: 400 })
    }
    html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            html, body { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; background: transparent; }
          </style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              key: '${key}',
              format: 'iframe',
              height: ${height},
              width: ${width},
              params: {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/${key}/invoke.js"></script>
        </body>
      </html>
    `
  }

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  })
}
