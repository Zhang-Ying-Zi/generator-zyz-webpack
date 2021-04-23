const Generator = require("yeoman-generator");
const remote = require("yeoman-remote");
const config = require("./config.js");
const mkdirp = require("mkdirp");
const path = require("path");
const _ = require("lodash");

let templateData = {
  typescript: false,
  react: false,
  vue: false,
};

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    for (let optionName in config.options) {
      this.option(optionName, config.options[optionName]);
    }
  }

  prompting() {
    this.prevShareConfig = this.fs.readJSON(".yo-rc.json") || {};

    let prompts = [];
    for (let prompt of config.prompts) {
      if (this.options.hasOwnProperty(prompt.name)) {
        // this.options 可能是由composeWith传入
        // 权限最高
        // 如果是composeWith传入，请保持同一参数都由composeWith传入，因为yo-rc.json中的顺序不固定，可能会冲突
        templateData[prompt.name] = this.options[prompt.name];
        this.config.set(prompt.name, this.options[prompt.name]);
      } else {
        let isFindInOtherYoConfig = false;
        // 其他generator的配置项
        for (let otherYoConfigKey in this.prevShareConfig) {
          if (
            this.prevShareConfig[otherYoConfigKey].hasOwnProperty(prompt.name)
          ) {
            templateData[prompt.name] = this.prevShareConfig[otherYoConfigKey][
              prompt.name
            ];
            isFindInOtherYoConfig = true;
            break;
          }
        }
        // 未被其他generator影响的prompt
        if (!isFindInOtherYoConfig) {
          prompts.push(prompt);
        }
      }
    }

    return prompts.length
      ? this.prompt(prompts).then((answers) => {
          for (let answerName in answers) {
            templateData[answerName] = answers[answerName];
            this.config.set(answerName, answers[answerName]);
          }
        })
      : null;
  }

  writing() {
    // from github
    const copy = (input, output) => {
      this.fs.copy(input, this.destinationPath(output));
    };
    // from local template using EJS
    const copyTpl = (input, output, data) => {
      this.fs.copyTpl(
        this.templatePath(input),
        this.destinationPath(output),
        data
      );
    };

    // Make Dirs
    config.dirsToCreate.forEach((item) => {
      mkdirp(item);
    });

    // Merge Files
    config.filesToMerge.forEach((file) => {
      let fileJSON = this.fs.readJSON(file.file);
      fileJSON = _.merge(fileJSON, file.default || {});
      for (let keyData in templateData) {
        if (templateData[keyData] && file[keyData])
          fileJSON = _.merge(fileJSON, file[keyData] || {});
      }
      this.fs.writeJSON(file.file, fileJSON);
    });

    // Render Files
    config.filesToRender.forEach((file) => {
      if (!file.if || templateData[file.if]) {
        copyTpl(file.input, file.output, templateData);
      }
    });

    // Get Remote Templates
    let done = this.async();
    remote(
      "Zhang-Ying-Zi",
      "generator-zyz-webpack-source",
      (err, cachePath) => {
        // Copy Files
        config.filesToCopy.forEach((file) => {
          if (!file.if || templateData[file.if]) {
            copy(path.join(cachePath, file.input), file.output);
          }
        });

        done();
      }
    );
  }

  install() {
    if (!this.options["skip-install"]) {
      this.npmInstall();
    }
  }
};
