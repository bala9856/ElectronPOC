import { test as base, _electron as electron, Page, ElectronApplication, BrowserContext } from '@playwright/test';
import { resolve } from 'node:path';
import * as path from 'path';

type Fixtures = {
  electronApp: ElectronApplication;
  mainWindow: Page;
  videoPage: Page;
};

export const test = base.extend<Fixtures>({
 electronApp: async ({}, use, testInfo) => {
    const recordingOptions = testInfo.project.use.video ? {
        dir: path.join(testInfo.outputDir, 'videos'),
    } : undefined;

    const app = await electron.launch({
      //args: ['F:/ElectronAppPOC/src/main.js'],  
    //----------------code for eddless Mode-----------------//
       args: ['F:/ElectronAppPOC/src/main.js','--headless','--disable-gpu', ],
    //   env:{
    //     ELECTRON_HEADLESS : 'true'
    //   },
    //   recordVideo: recordingOptions,
      recordVideo: recordingOptions,
    });
    await use(app);
    await app.close();
  },

  mainWindow: async ({ electronApp }, use, testInfo) => {
    let appWindow: Page | undefined;
    await new Promise(resolve => setTimeout(resolve, 5000));
    const allWindows = electronApp.windows();
    for (const w of allWindows) {
      const title = await w.title();
      if (title.includes('DevTools')) {
        await w.close();
      } else {
        appWindow = w;
        break;
      }
    }
    if (!appWindow) throw new Error("Main React window not found!");
    await use(appWindow);
    const screenshot = await appWindow.screenshot();
    await testInfo.attach(`${testInfo.title}`, {
      body: screenshot,
      contentType: 'image/png',
     });
    const video = appWindow.video();
    await appWindow.close();
    if (video) {
    const videoOutputPath = path.join(testInfo.outputDir, 'videos', `${testInfo.title}.webm`);

        // Use saveAs() to move and finalize the video to the desired path.
        await video.saveAs(videoOutputPath);
        console.log(`Video saved at: ${videoOutputPath}`);
        await testInfo.attach(`${testInfo.title} Video`, {
          path: videoOutputPath,
          contentType: 'video/webm',
        });
  }
},
});
export { expect } from '@playwright/test';
