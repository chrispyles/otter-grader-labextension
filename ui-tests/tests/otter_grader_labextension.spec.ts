import { expect, test } from '@jupyterlab/galata';

/**
 * Don't load JupyterLab webpage before running the tests.
 * This is required to ensure we capture all log messages.
 */
test.use({ autoGoto: false });

// TODO: add tests

test('should add an item to the Edit menu', async ({ page }) => {
  await page.goto();
  await page.waitForLoadState('networkidle');

  await page.menu.clickMenuItem('Edit>Otter-Grader');
  expect(await page.screenshot()).toMatchSnapshot('menu.png');
});
