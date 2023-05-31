import templateSrv from 'app/features/templating/template_srv';

export class TemplateChange {
  private templateSrv: any = templateSrv;
  //query.targets or normal arr, 不需要返回值
  changeTargets(targets) {
    var jz = this.templateSrv.replace('$jz');
    if (jz === '$jz') {
      return;
    }
    var dc = this.templateSrv.replace('$dc');
    for (var i = 0; i < targets.length; i++) {
      var temp = targets[i].target;
      if (temp === undefined) {
        temp = targets[i];
      }
      if (dc !== '$dc') {
        temp = dc + temp.substring(5); //替换电厂5位
      }
      temp = temp.substring(0, 6) + jz + temp.substring(8); //替换机组2位
      if (targets[i].target === undefined) {
        targets[i] = temp;
      } else {
        targets[i].target = temp;
      }
    }
  }

  //空间轴线等，需要返回值，根据dc,jz替换
  changeStart(srcKKS) {
    let jz = this.templateSrv.replace('$jz');
    if (jz === '$jz') {
      return srcKKS;
    }
    let dc = templateSrv.replace('$dc');
    if (dc !== '$dc') {
      if (srcKKS.indexOf('[[dc]]') != -1) {
        srcKKS = srcKKS.replace('[[dc]]', dc);
      } else {
        srcKKS = dc + srcKKS.substring(5); //替换电厂5位
      }
    }
    if (srcKKS.indexOf('[[jz]]') != -1) {
      return srcKKS.replace('[[jz]]', jz);
    } else {
      return srcKKS.substring(0, 6) + jz + srcKKS.substring(8); //替换机组2位
    }
  }

  //趋势分析 动态增加查询的kks ==> templateSrv.kksCache.selectTargets
  addPoints(targets, attribute) {
    if (attribute === undefined) {
      attribute = 'target';
    }

    if (this.templateSrv.selectTargets && targets.length === 1 && targets[0][attribute] === '__shu-zhi-fen-xi') {
      targets.splice(0, targets.length); //不可targets = []
      let selectTargets = this.templateSrv.selectTargets;
      for (var j = 0; j < selectTargets.length; j++) {
        var targetObj = {}; //查询kdm历史点值
        targetObj[attribute] = selectTargets[j];
        targets.push(targetObj); //每次query.targets都是空的，不需要考虑是否重复
      }
    }
  }
}

export default new TemplateChange();
