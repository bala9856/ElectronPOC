const { _electron: electron } = require('playwright');
import { HomePage } from './electronPages/HomePage';
import { Luminometer } from './electronPages/LuminometerPage';
//import testData from './testData.json'
import { test, expect } from './fixtures/launchFixture';
//const fs = require('fs');
import * as fs from "fs";
import * as path from "path";

const filePath = path.resolve(__dirname,"data","testData.json");
const rawData = fs.readFileSync(filePath, 'utf-8');
const testData = JSON.parse(rawData);
export {testData};
test.describe("User Managment",() => {
 test('Verify Home Page',{tag: ['@positive', '@regression']}, async ({mainWindow},testinfo) => {
    const homePage = new HomePage(mainWindow);
    await homePage.printTitle();
    await homePage.verifyMainHeading();
    await homePage.verifyTabHeading();
    await homePage.verifyluminometer();
    await homePage.verifyUSBDevice();
    await homePage.verifyTabledetails();
  });

  test('create User',{tag: ['@positive', '@regression']}, async ({mainWindow},testinfo) => {
    const name =  testData.userplayWright.username;
    const eMail = testData.userplayWright.Email;
    const age = testData.userplayWright.Age;
    console.log(`Name: ${name}, EmailID: ${eMail}, Age: ${age} `)
    const homePage = new HomePage(mainWindow);
    await homePage.clickAddbutton();
    await homePage.timeOutWait();
    await homePage.enterName(name);
    await homePage.enterEmail(eMail);
    await homePage.enterAge(age);
    await homePage.verifycheckBox();
    await homePage.selectCategory();
    await homePage.clickCreate();
    await homePage.timeOutWait();
    await homePage.verifyName();
    await homePage.verifyEmail();
    await homePage.verifyAge();
    console.log("Customer created successfully");
    const ss = await mainWindow.screenshot();
    testinfo.attach("screenShot", {
    body: ss,
    contentType: "image/png"
    });
  });

  test('Update User',{tag: ['@positive', '@regression']}, async ({mainWindow},testinfo) => {
    const homePage = new HomePage(mainWindow);
    const name = testData.userplayWright.username;
    const updatedName =  testData.userplayWright.NewName;
    await homePage.printTitle();
    await homePage.clickEdit();
    await homePage.updateName(updatedName);
    await homePage.clickUpdate();
    console.log(`Customer name updated from ${name} to ${updatedName}`);
  });

  test('Delete User',{tag: ['@positive', '@regression']}, async ({mainWindow},testinfo) => {
    const homePage = new HomePage(mainWindow);
    await homePage.printTitle();
    await homePage.deleteDetails();
    await homePage.clickDelete();
    console.log("Customer Deleted");
  });

  test('Negative check on Age',{tag: ['@negative', '@regression']}, async ({mainWindow},testinfo) => {
    const homePage = new HomePage(mainWindow);
    const name =  testData.userplayWright.username;
    const eMail = testData.userplayWright.Email;
    const age = testData.userplayWright.Agengv;
    await homePage.printTitle();
    await homePage.clickAddbutton();
    await homePage.enterName(name);
    await homePage.enterEmail(eMail);
    await homePage.enterAgeNeg(age);
    await homePage.clickCreate();
    await homePage.timeOutWait();
    await homePage.verifyName();
    await homePage.verifyEmail();
    await homePage.negAgeVrt();
    await homePage.clickDelete();
    console.log("Entered string in number field age");
  });

  test('Verify Luminometer',{tag: ['@negative', '@regression']}, async ({mainWindow},testinfo) => {
    const luminometer = new Luminometer(mainWindow);
    await luminometer.pageTittle();
    await luminometer.conectvityStatus();
    await luminometer.clickConnect();
    await luminometer.devicedetails();

  });

  test.only('newUpdate with all fields',{tag: ['@positive', '@regression']}, async ({mainWindow},testinfo) => {
    const name =  testData.userplayWright.username;
    const eMail = testData.userplayWright.Email;
    const age = testData.userplayWright.Age;
    const skills:string [] = testData.userplayWright.skills;
    const image = testData.userplayWright.image;
    const DOB = testData.userplayWright.DOB;
    const cata = testData.userplayWright.Category;
    console.log(`Name: ${name}, EmailID: ${eMail}, Age: ${age}, skills: ${skills}, DOB:${DOB} `)
    const homePage = new HomePage(mainWindow);
    await homePage.clickAddbutton();
    await homePage.timeOutWait();
    await homePage.enterName(name);
    await homePage.enterEmail(eMail);
    await homePage.enterAge(age);
    await homePage.verifycheckBox();
    await homePage.selectCategory();
    await homePage.clickSkillsDD();
    await homePage.selectSkills(skills);
    await homePage.closeskillDD();
    await homePage.uploadImage(image);
    await homePage.selectGender();
    await homePage.giveDOB();
    await homePage.timeOutWait();
    await homePage.clickCreate();
    await homePage.timeOutWait();
  });

  test('Luminometer Connection',{tag: ['@positive', '@regression']}, async ({mainWindow},testinfo) => {
    const homePage = new HomePage(mainWindow);
    const command = testData.userplayWright.command;
    await homePage.clickluminometer();
    const luminometer = new Luminometer(mainWindow);
    await luminometer.pageTittle();
    await luminometer.conectvityStatus();
    await luminometer.clickConnect();
    await luminometer.devicedetails();
    await homePage.timeOutWait();
    await luminometer.addCommand(command);
    console.log("Customer Deleted");
  });

});

//allure serve allure-results