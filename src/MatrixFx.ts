
/**
 * @author  raizensoft.com
 */

import { Application, Container, Text } from "pixi.js";

const APP_WIDTH = 1000;
const APP_HEIGHT = 600;

/**
 * MatrixFx 
 * @class MatrixFx
 */
export default class MatrixFx {

  root:HTMLDivElement;
  container:Container;

  constructor(root:HTMLDivElement) {

    this.root = root;
    this.init();
  }

  /**
   * Init class components
   * @method init
   */
  init() {

    const pa = new Application({width:APP_WIDTH, height:APP_HEIGHT, backgroundColor:0x111111});
    this.root.appendChild(pa.view);

    const c = this.container = new Container();
    pa.stage.addChild(this.container);

    const CHARACTER_COUNT = 28; // Total character count in one column
    const CHARACTER_SET = 'abcdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ01234567890+-*/<>[]{}';
    const CHARACTER_COLORS = ['#3EF950', '#FF7BAC', '#FFCC00', '#5befeb'];

    const textStyle = {fontFamily:"Verdana", fontSize:16, fill:[CHARACTER_COLORS[Math.floor(Math.random() * CHARACTER_COLORS.length)]]};

    // Matrix character reference
    const cmatrix:any = [];

    // Hold the current index of the most visible character in the column
    const alphaIndexes:any = [];

    // Generate character for each column
    const generateCharacters = (xp:number = 0) => {

      const clist:Text[] = [];
      for (let i = 0; i < CHARACTER_COUNT; i++) {

        const char = CHARACTER_SET[Math.floor(Math.random() * CHARACTER_SET.length)];
        const t = new Text(char, textStyle);
        clist.push(t);
        t.x = xp;
        t.y = i * 22; // Character vertical spacing = 22
        c.addChild(t);
      }
      alphaIndexes[cmatrix.length] = Math.floor(Math.random() * CHARACTER_COUNT);
      cmatrix.push(clist);
    };

    // Generate the whole matrix with 48 columns
    for (let i = 0; i < 48; i++) {
      generateCharacters(i * 20 + 24);
    }

    const shuffleCharacters = (clist:Text[]) => {

      for (let i = clist.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = clist[i];
        let yi = clist[i].y;
        let yj = clist[j].y;
        clist[i] = clist[j];
        clist[j] = temp;
        clist[i].y = yi;
        clist[j].y = yj;
      }
    }

    // Update routines
    setInterval(() => {

      for (let count = 0; count < 48; count++) {

        let alphaIndex = alphaIndexes[count];

        const clist = cmatrix[count];

        // Calculate alpha for each character in the column
        for (let i = 0; i < CHARACTER_COUNT; i++) {
          const c = clist[i];
          c.alpha = 1 / (Math.abs(i - alphaIndex) + 0.25);
        }
        alphaIndexes[count]++;

        // Shuffle the characters when reaching the end of column
        if (alphaIndexes[count] == CHARACTER_COUNT) {

          alphaIndexes[count] = 0;

          shuffleCharacters(clist);

          // Reapply alpha indexes
          for (let i = 0; i < CHARACTER_COUNT; i++) {
            const c = clist[i];
            c.alpha = 1 / (Math.abs(i - alphaIndex) + 0.25);
          }
        }
      }
    }, 80);
  }
}
