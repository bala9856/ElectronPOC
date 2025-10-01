import {expect, Location, Locator, Page} from "@playwright/test";

export class Luminometer{
    readonly page:Page;
    readonly title:Locator;
    readonly deviceStatus:Locator;
    readonly btnconnect:Locator;
    readonly devicedet:Locator;
    readonly btnReconect:Locator;
    readonly currentdetails:Locator;
    readonly Command:Locator;
    readonly btnsend:Locator;
    readonly sentcommand:Locator;

    constructor(page:Page){
        this.page = page;
        this.title = page.locator("//h1[contains(@class,'MuiTypography-h4')]");
        this.deviceStatus = page.locator("//h6[text()='Device Status']/parent::div/child::div//p");
        this.btnconnect = page.locator("//h6[text()='Device Status']/parent::div/child::div//button[text()='Connect']");
        this.devicedet = page.locator("//h6[text()='Device Status']/parent::div//div[@class='MuiBox-root css-0']");
        this.btnReconect = page.locator("//h6[text()='Device Status']/parent::div/child::div//button[text()='Reconnect']");
        this.currentdetails = page.locator("//h6[text()='Current Data']/parent::div/following-sibling::div[@class='MuiBox-root css-0']");
        this.Command = page.locator("//h6[text()='Send Command']/parent::div//input[@type='text']");
        this.btnsend = page.locator("//button[text()='Send']");
        this.sentcommand = page.locator("//h6[text()='Response:']/parent::div//pre");
    }

    async pageTittle(){
        console.log(await this.title.textContent());
    }
    async conectvityStatus(){
        console.log(`Device status: ${await this.deviceStatus.textContent()}`);
    }
    async clickConnect(){
        await expect(this.btnconnect).toBeEnabled();
        await this.btnconnect.click();
    }
    async devicedetails(){
        await expect (this.btnconnect).not.toBeVisible();
        await expect (this.btnReconect).toBeVisible();
        await expect(this.devicedet).toBeVisible();
        console.log("Device details: ");
        console.log(await this.devicedet.innerText());
    }

    async currentDetails(){
        await expect(this.currentdetails).toBeVisible();
        console.log("Current Details");
        console.log(await this.currentdetails.innerText());
    }
    
    async addCommand(command:string){
        await expect(this.btnsend).toBeDisabled();
        await this.Command.fill(command);
        await expect(this.btnsend).toBeEnabled();
        await this.btnsend.click();
        await expect(this.sentcommand).toBeVisible();
        await expect(this.sentcommand).toContainText(command);
    }

}