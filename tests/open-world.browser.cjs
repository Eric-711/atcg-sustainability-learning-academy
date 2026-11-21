const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  try {
    await page.goto(pathToFileURL(path.resolve('open-world.html')).href);
    await page.locator('#game').waitFor();
    await page.waitForTimeout(600);
    assert.equal(await page.locator('#characterChoices button').count(),6,'character choices');
    assert.equal(await page.locator('#vehicleChoices button').count(),6,'vehicle choices');
    assert.equal(await page.locator('#missions button').count(),8,'missions');
    await page.locator('#playerName').fill('Test Explorer');
    assert.match(await page.locator('#characterIdentity').innerText(),/Test Explorer/);
    await page.locator('#vehicleChoices button').nth(2).click();
    assert.match(await page.locator('#vehicleChoices button').nth(2).innerText(),/Selected/);
    await page.locator('#missions button').first().click();
    await page.locator('#answers button').first().click();
    assert.match(await page.locator('#result').innerText(),/Correct/);
    assert.match(await page.locator('#xp').innerText(),/100 XP/);
    await page.locator('#close').click();
    await page.reload();
    assert.match(await page.locator('#xp').innerText(),/100 XP/);
    assert.match(await page.locator('#characterIdentity').innerText(),/Test Explorer/);
    assert.match(await page.locator('#vehicleChoices button').nth(2).innerText(),/Selected/);
    await page.locator('[data-key="ArrowUp"]').dispatchEvent('pointerdown',{pointerId:1});
    await page.waitForTimeout(300);
    await page.locator('[data-key="ArrowUp"]').dispatchEvent('pointerup',{pointerId:1});
    assert.equal(await page.locator('#game').evaluate(el=>el.width>0&&el.height>0),true,'canvas dimensions');
    assert.deepEqual(errors,[],'browser JS errors');
    console.log('PASS: Chromium mobile smoke test, selections, mission, score, persistence, touch controls and canvas');
  } finally {await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
