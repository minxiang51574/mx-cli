/*
 * @Author: Mx
 * @Date: 2022-06-17 11:09:55
 * @Description: 
 */
const inquirer = require("inquirer");
const downloadGitRepo = require("download-git-repo");
const chalk = require("chalk");
const util = require("util");
const path = require("path");

const { loading1 , loading2 } = require("./util");

class Creator {
  // 项目名称及项目路径
  constructor(name, targetDirectory) {
    this.name = name;
    this.targetDirectory = targetDirectory;
    // 转化为 promise 方法
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 创建项目部分
  async create() {
    // 1.选择模板
    let temp = await this.getTempInfo();

    // 2.选择仓库
    let repo = await this.getRepoInfo(temp);

    // 3.下载模板
    await this.download(temp,repo);
  }

  // 1.选择模板 小程序、后台系统
  async getTempInfo() {
    await loading1("waiting for fetching template");
    // 模板名
    const tempList = ["小程序", "后台系统"];
    // 选取模板信息
    let { temp } = await new inquirer.prompt([
      {
        name: "temp",
        type: "list",
        message: "Please choose a template to create project:",
        choices: tempList,
      },
    ]);
    return temp;
  }

  // 
  /**
   * 2.选择仓库
   * @param  模板 temp 
   */
  async getRepoInfo(temp){
    await loading1("waiting for fetching repository");
    // 模板名
    let repos = [];
    if(temp === '小程序'){
      repos = ['v2', 'v3'];
    }else if(temp === '后台系统'){
      repos = ['v3'];
    }
    // 选取模板信息
    let { repo } = await new inquirer.prompt([
      {
        name: "repo",
        type: "list",
        message: "Check the features needed for your project:",
        choices: repos,
      },
    ]);
    return repo;
  }

  /**
   * 3.下载git仓库
   * @param  模板 temp 
   * @param  仓库 repo 
   */
  async download(temp,repo) {
    if(temp === '小程序'){

      console.log(`\r\n  ${chalk.red("模板正在赶来的路上")}`);

    }else if (temp === "后台系统") {
      //下载地址方式 
      // 1.github地址加分支
      // let downloadUrl = "minxiang51574/mxVue#master"
      // 2.direct
      let downloadUrl = `direct:http://mx-git1.kemai.cn/minxiang/mx-uniViteTs-template#${repo}`

      await loading2(
        "downloading, please wait",
        this.downloadGitRepo,
        downloadUrl,
        path.resolve(process.cwd(), this.targetDirectory), // 项目创建位置
        { clone: true }
      );

      //成功提示
      this.successTip()
    }
  }

  // 4.模板使用提示
  successTip(){
    console.log(
      `${chalk.green("Successfully created project")} ${chalk.cyan(this.name)}`
    );
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
    console.log("  npm install");
    console.log("  npm run serve\r\n");
  }

}

module.exports = Creator;
