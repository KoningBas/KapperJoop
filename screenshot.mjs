import puppeteer from 'puppeteer'
import { existsSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCREENSHOTS_DIR = join(__dirname, 'temporary screenshots')

if (!existsSync(SCREENSHOTS_DIR)) mkdirSync(SCREENSHOTS_DIR)

const url = process.argv[2] || 'http://localhost:3000'
const label = process.argv[3] || ''

// Find next available number
const existing = existsSync(SCREENSHOTS_DIR)
  ? readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png'))
  : []
const nums = existing.map(f => parseInt(f.replace(/\D/g, '')) || 0)
const next = nums.length > 0 ? Math.max(...nums) + 1 : 1

const filename = label
  ? `screenshot-${next}-${label}.png`
  : `screenshot-${next}.png`
const outPath = join(SCREENSHOTS_DIR, filename)

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: outPath, fullPage: false })

await browser.close()
console.log(`Screenshot saved: ${outPath}`)
