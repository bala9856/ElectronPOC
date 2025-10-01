import {expect, Locator, Page} from "@playwright/test";
import{testData} from "../electron.spec";
 
export class HomePage{
 
    readonly page:Page;
    readonly heading:Locator;
    readonly User_Management:Locator;
    readonly luminometer:Locator;
    readonly USB_device:Locator;
    readonly UMheading:Locator;
    readonly tableheading:Locator;
    readonly tableBody:Locator;
    readonly btnAddUser:Locator;
    readonly namefield:Locator;
    readonly emailfield:Locator;
    readonly agefield:Locator;
    readonly btnCancel:Locator;
    readonly btnCreate:Locator;
    readonly crName:Locator;
    readonly crMail:Locator;
    readonly crAge:Locator;
    readonly ngAge:Locator;
    readonly btnDelete:Locator;
    readonly lastName:Locator;
    readonly lastEmail:Locator;
    readonly lastAge:Locator;
    readonly vrfyActive:Locator;
    readonly btnEdit:Locator;
    readonly btnUpdate:Locator;
    readonly Nameafter:Locator;
    readonly checkBox:Locator;
    readonly Category:Locator;
    readonly catOption:Locator;
    readonly skillDD:Locator;
    readonly closeDD:Locator;
    readonly skillsadd:Locator;
    readonly btnupload:Locator;
    readonly gender:Locator;
    readonly dateOfBirth:Locator;
    readonly vfyCata:Locator;
    readonly vfyimage:Locator;
    readonly vfyskills:Locator;
    readonly vfyGender:Locator;
    readonly vfyDOB:Locator;
    readonly addusertittle:Locator;
 
    constructor(page:Page){
        this.page = page;
        this.heading = page.locator("//h1[contains(@class,'MuiTypography-h3')]");
        this.User_Management = page.locator('//button[@role="tab" and contains(text(),"User Management")]');
        this.luminometer = page.locator('//button[@role="tab" and contains(text(),"Luminometer")]');
        this.USB_device = page.locator('//button[@role="tab" and contains(text(),"USB Devices")]');
        this.UMheading = page.locator("//h2[contains(@class,'MuiTypography-h4')]");
        this.tableheading = page.locator("//thead");
        this.tableBody = page.locator("//tbody");
        this.btnAddUser = page.locator('//button[@type="button" and contains(text(),"Add User")]');
        this.namefield = page.locator("//input[@type='text']");
        this.emailfield = page.locator("//input[@type='email']");
        this.agefield = page.locator("//input[@type='number']");
        this.btnCancel = page.locator("//button[text()='Cancel']");
        this.btnCreate = page.locator("//button[text()='Create']");
        this.crName = page.locator(`//tbody//tr//td//div[text()='${testData.userplayWright.username}']`).last();
        this.crMail = page.locator(`//tbody//tr//td[text()='${testData.userplayWright.Email}']`).last();
        this.crAge = page.locator(`//tbody//tr//td[text()='${testData.userplayWright.Age}']`).last();
        this.ngAge = page.locator(`//tbody//tr//td[text()='${testData.userplayWright.Agengv}']`).last();
        this.btnDelete = page.locator(`svg[data-testid='DeleteIcon']`).last();
        this.lastName = page.locator("//tbody//tr//td[2]").last();
        this.lastEmail = page.locator("//tbody//tr//td[3]").last();
        this.lastAge = page.locator("//tbody//tr//td[4]").last();
        this.btnEdit = page.locator("svg[data-testid='EditIcon']").last();
        this.btnUpdate = page.locator("//button[text()='Update']");
        this.Nameafter = page.locator(`//tbody//tr//td[text()='${testData.userplayWright.NewName}']`);
        this.checkBox = page.locator("//input[@type='checkbox']");
        this.Category = page.locator("//div[@aria-controls=':r5:']");
        this.catOption = page.locator(`//li[@data-value='${testData.userplayWright.Category}']`);
        this.skillDD = page.locator("//div[@aria-controls=':r6:']/parent::div");
        this.closeDD = page.locator("//div[@aria-expanded='true']");
        this.skillsadd = page.locator(`//ul//li[@data-value='${testData.userplayWright.skills}']`);
        this.btnupload = page.locator("//input[@type='file']");
        this.gender = page.locator(`//input[(@type='radio')and(@value='${testData.userplayWright.gender}')]`)
        this.dateOfBirth = page.locator("//input[@type='date']");
        this.vrfyActive = page.locator("//tbody//tr//td[5]").last();
        this.vfyCata = page.locator("//tbody//tr//td[6]").last();
        this.vfyimage = page.locator("//tbody//tr//td[2]//img").last();
        this.vfyskills = page.locator("//tbody//tr//td[7]").last();
        this.vfyGender = page.locator("//tbody//tr//td[8]").last();
        this.vfyDOB = page.locator("//tbody//tr//td[9]").last();
        this.addusertittle = page.locator("//h2[text()='Add User']");
    }
 
    async timeOutWait(){
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
 
    async clickluminometer(){
        await this.luminometer.click();
    }
    async printTitle(){
       console.log(`Title of the page: ${await this.page.title()}`);
    }
 
    async verifyMainHeading(){
        console.log(`Main heading of the page: ${await this.heading.textContent()}`);
    }
 
    async verifyTabHeading(){
        console.log(`Title of the page: ${await this.UMheading.textContent()}`);
    }
     
    async verifyluminometer(){
        await expect(this.luminometer).toBeVisible();
    }
 
    async verifyUSBDevice(){
        await expect(this.USB_device).toBeVisible();
    }
 
    async verifyTabledetails(){
        if (await this.tableBody.isHidden()){
            console.log("No existing detials present");
        }
        else {
        await expect(this.tableBody).toBeVisible();
        console.log(await this.tableheading.innerText());
        console.log(await this.tableBody.innerText());
        }
    }
 
    async clickAddbutton(){
        await this.btnAddUser.click();
    }
 
    async enterName(name:string){
        await this.namefield.fill(name);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    async enterEmail( email:string){      
        await this.emailfield.fill(email);
    }
    async enterAge(age:string){
        await this.agefield.fill(age);
    }
 
    async enterAgeNeg(age:string){
        await this.agefield.pressSequentially(age);
    }
 
    async clickCancle(){
        await this.btnCancel.click();
    }
 
    async clickCreate(){
       await this.btnCreate.click();
    }
 
    async verifyName(){
       await expect( this.crName).toBeVisible();
    }
 
    async verifyEmail(){
        await expect(this.crMail).toBeVisible();
    }
 
    async verifyAge(){
        await expect(this.crAge).toBeVisible();
    }
 
    async negAgeVrt(){
        await expect(this.ngAge).toBeVisible();
    }
   
    async deleteDetails(){
        console.log("Deatils of the customer that is deleted");
        console.log( (`Name: ${await this.lastName.textContent()}`));
        console.log( (`Email: ${await this.lastEmail.textContent()}`));
        console.log( (`Age: ${await this.lastAge.textContent()}`));
    }
 
    async clickDelete(){
        await this.btnDelete.click();
    }
 
    async clickEdit(){
        await this.btnEdit.click();
    }
 
    async updateName(name:string){
        await this.namefield.clear();
        await this.namefield.fill(name);
    }
 
    async clickUpdate(){
        await this.btnUpdate.click();
    }
 
    async verifyUpdate(){
        //await expect(this.Nameafter).toBeVisible();
        await expect(this.crName).toBeHidden();
    }
 
    async verifycheckBox(){
        await expect(this.checkBox).toBeChecked();
        await this.checkBox.uncheck();
        await (expect(this.checkBox).not.toBeChecked());
        await this.checkBox.check({force:true});
    }
 
    async disableCheckBox(){
        if(await this.checkBox.isChecked()){
            await this.checkBox.click({force:true});
            console.log("checkBox is disabled");
        }
    }
 
    async selectCategory(){
        await this.Category.click();
        await this.catOption.click();
    }
 
    async clickSkillsDD(){
        await this.skillDD.click();
    }
 
    async selectSkills(values:string[]){
        for (const skill of values){
            const options = this.page.locator(`//ul//li[@data-value='${skill}']`);
            await options.click({force:true});
        }
    }
    async closeskillDD(){
        await this.page.keyboard.press('Escape');
    }
 
    async uploadImage(imagepath:string){
        await this.btnupload.setInputFiles(imagepath);
    }
 
    async selectGender(){
        await this.gender.click();
    }
 
    async giveDOB(){
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); // Month starts from 0
        const yyyy = today.getFullYear();
        const formattedDate = `${dd}-${mm}-${yyyy}`;
        await this.dateOfBirth.clear();
        await this.dateOfBirth.pressSequentially(formattedDate);
    }
 
    async verifyActivestatus(){
        await expect(this.vrfyActive).toBeVisible();
       
    }
 
    async verifyGender(){
        await expect(this.vfyGender).toBeVisible();
        await expect(this.vfyGender).not.toBeEmpty();
        const gendervalue = await this.vfyGender.textContent();
        console.log("gender "+gendervalue);
        expect (gendervalue===(testData.userplayWright.gender));
    }
 
    async highttitle(){
        await this.addusertittle.highlight();
    }
}