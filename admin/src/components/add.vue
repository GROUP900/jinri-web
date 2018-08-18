<template>
<div class="container">
  <p class="step">{{steptext}}</p>
  <div class="editarea">

    <template v-if='step==0'>
      <form ref="imgform" style="display:none;">
        <input @change="uploadpic($event)" id='imginput' type="file" accept="image/png,image/jpeg" />
      </form>
      <label for='imginput'>
      <div class="imgpreview">
        <img ref="image" :src="dispimguri">
        <span>点击修改</span>
      </div>
      </label>
</template>

<template v-if='step==1'>
<form ref="wpimgform" style="display:none;">
  <input @change="uploadwppic($event)" id='wpimginput' type="file" accept="image/png,image/jpeg" />
</form>
<label for='wpimginput'>
  <div class="imgpreview">
    <img ref="wpimage" :src="wpdispimguri">
    <span>点击修改</span>
  </div>
  </label>
</template>

    <template v-else-if='step==2'>
<div class="colorpicker">
  <div class="color" :style="{ background: color}"></div>
  <p class='iscomputed' :class="{ invisible: selectedcolor }">正在使用自动拾取的颜色</p>
  <sliderPicker v-model="colors" @input="updatecolor"></sliderPicker>
  <div class="colorcontrol">
    <span>手动拾色</span>
    <a href="#" @click='dropselected'>恢复自动拾取的颜色</a>
  </div>
</div>
</template>
    <template v-else-if='step==3'>
<p class="guide">
  请在下方输入可选的文案，不输入则不显示文案。<br> 文案最多5行，只在PC端显示。
</p>
<textarea class='content' placeholder="输入5行以内的文案" v-model='content'></textarea>
</template>
    <template v-else-if='step==4'>
<p class="guide">
  如不手动选择日期，当前日签将作为明天的日前发布。<br>
  同一日只可发布1签，日期相同将覆盖较旧的日签。
</p>
<p class="datehint">将在以下日期发布</p>
<p class='date'>{{dispdate}}</p>
<div class="datepickerwraper">
  <input id='datepicker' type="date" v-model='dateselected'>
  <label class='hidden-dt datepickerlabel' for='datepicker'>手动选择</label>
</div>
<div v-bind:class="{ active: force }" @click='toggleforce' v-if="showChecker" class="forcechecker">强制发布</div>
</template>
  </div>
  <div class="stepbtn">
    <div v-if='step==0'></div>
    <a href="#" v-if='step!==0' @click="step -= 1" class="yellow">返回</a>
    <a href="#" v-if='step!==4' @click="nextstep" class="green">下一步</a>
    <a v-if='step==4' href="#" @click="submit" class="red">发布</a>
  </div>
</div>
</template>

<script>
import {
  Slider
} from 'vue-color'
var moment = require('moment');
var cos = require("../scripts/cosinit.js");
var rgbaster = require("../scripts/rgbaster.min.js");
export default {
  name: 'add',
  data() {
    return {
      dateselected: '',
      content: '',
      colors: {
        hex: '#FA0101'
      },
      step: 0,
      uploadbusy: false,
      imguri: '',
      wpimguri: '',
      computedcolor: '',
      selectedcolor: '',
      showChecker: false,
      force: false,
      editmode: false
    }
  },
  components: {
    'sliderPicker': Slider
  },
  computed: {
    dispdate: function() {
      return this.dateselected.replace(/-/g, '/');
    },
    wpdispimguri: function() {
      if (!this.wpimguri) {
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';
      } else {
        return this.bucketUrl + '/jinri/' + this.wpimguri;
      }
    },
    dispimguri: function() {
      if (!this.imguri) {
        return 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';
      } else {
        return this.bucketUrl + '/jinri/' + this.imguri;
      }
    },
    color: function() {
      if (this.selectedcolor) {
        return this.selectedcolor;
      } else if (this.computedcolor) {
        return this.computedcolor;
      } else {
        return '#000'
      }
    },
    steptext: function() {
      switch (this.step) {
        case 0:
          return '上传日签';
          break;
        case 1:
          return '上传背景（可选）';
          break;
        case 2:
          return '选择主色';
          break;
        case 3:
          return '输入文案（可选）';
          break;
        case 4:
          return '选择日期并发布';
          break;
      }
    }
  },
  methods: {
    toggleforce: function() {
      this.force = !this.force;
    },
    submit: function() {
      var bundle = {};
      bundle.day = this.dateselected;
      bundle.content = this.content;
      bundle.color = this.color;
      bundle.uri = this.imguri;
      bundle.wpimguri = this.wpimguri;
      if (this.editmode) {
        bundle.editmode = true;
        bundle.id = this.$route.params.id;
      }
      if (this.force) {
        bundle.mode = 'force';
      }
      if (!bundle.day || !bundle.color || !bundle.uri) {
        return this.bus.$emit('popMessageComing', '信息丢失，请刷新');
      }
      this.ajax.post(this.apiUrl + 'su/add', bundle).then((res) => {
        switch (res.data) {
          case 'overlay':
            this.bus.$emit('popMessageComing', '选择的日期已存在日签，继续发布请勾选强制发布选项');
            this.showChecker = true;
            break;
          case 'done':
            this.bus.$emit('popMessageComing', '日签已更新，正在转向列表');
            setTimeout(() => this.$router.push({
              name: 'list'
            }), 500);
            break;
          case 'unknown':
            this.bus.$emit('popMessageComing', '未知的错误，请重试或联系智力猫');
            break;
        }
      })

    },
    dropselected: function() {
      this.selectedcolor = ''
    },
    updatecolor: function() {
      this.selectedcolor = 'rgb(' + this.colors.rgba.r + ',' +
        this.colors.rgba.g + ',' +
        this.colors.rgba.b + ')';
    },
    nextstep: function() {
      switch (this.step) {
        case 0:
          if (!this.imguri) {
            return this.bus.$emit('popMessageComing', '还没有上传主图');
          } else {
            RGBaster.colors(this.dispimguri, {
              paletteSize: 5,
              exclude: ['rgb(255,255,255)', 'rgb(0,0,0)'],
              success: (payload) => {
                this.computedcolor = payload.palette[1];
              }
            });
            this.step++;
          };
          break;
        default:
          this.step++;
      }
    },
    uploadwppic: function(ev) {
      var file = ev.target.files[0];


      if (file.size > 2097152) {
        return this.bus.$emit('popMessageComing', '尺寸大于2mb了...裁剪一下再发');
      }
      if (file.type == 'image/jpeg' || file.type == 'image/png') {

      } else {
        return this.bus.$emit('popMessageComing', '格式不对');
      }

      if (this.uploadbusy) {
        return this.bus.$emit('popMessageComing', '稍等，另一个文件正在上传');
        return;
      }
      this.uploadbusy = true;
      var uri = file.name.split('.')[0] + '-' + Date.now() + "-wp";
      uri = uri.replace(/\W/g, '_');
      cos.uploadFile(
        (cb) => {
          this.uploadbusy = false;
          this.bus.$emit('popMessageComing', '上传成功了');
          this.wpimguri = uri;
          this.$refs.wpimgform.reset();
        },
        () => {
          this.uploadbusy = false;
          this.bus.$emit('popMessageComing', '上传失败了...重试或联系智力猫');
          this.$refs.wpimgform.reset();
        },
        (cb) => {
          var progress = parseInt(cb * 100)
          this.bus.$emit('popMessageComing', '正在上传:' + progress + "%");
        },
        '900bucket',
        '/jinri/' + uri, file, 1);
    },
    uploadpic: function(ev) {
      var file = ev.target.files[0];


      if (file.size > 2097152) {
        return this.bus.$emit('popMessageComing', '尺寸大于2mb了...裁剪一下再发');
      }
      if (file.type == 'image/jpeg' || file.type == 'image/png') {

      } else {
        return this.bus.$emit('popMessageComing', '格式不对');
      }

      if (this.uploadbusy) {
        return this.bus.$emit('popMessageComing', '稍等，另一个文件正在上传');
        return;
      }
      this.uploadbusy = true;
      var uri = file.name.split('.')[0] + '-' + Date.now();
      uri = uri.replace(/\W/g, '_');
      cos.uploadFile(
        (cb) => {
          this.uploadbusy = false;
          this.bus.$emit('popMessageComing', '上传成功了');
          this.imguri = uri;
          this.$refs.imgform.reset();
        },
        () => {
          this.uploadbusy = false;
          this.bus.$emit('popMessageComing', '上传失败了...重试或联系智力猫');
          this.$refs.imgform.reset();
        },
        (cb) => {
          var progress = parseInt(cb * 100)
          this.bus.$emit('popMessageComing', '正在上传:' + progress + "%");
        },
        '900bucket',
        '/jinri/' + uri, file, 1);
    }
  },
  created: function() {
    if (this.$route.name == 'edit') {
      this.editmode = true;
      this.ajax(this.apiUrl + 'su/postinfo/' + this.$route.params.id).then((res) => {
        var info = res.data;
        this.dateselected = info.day;
        this.content = info.content;
        this.selectedcolor = info.color;
        this.imguri = info.uri;
        this.wpimguri = info.wpimguri;
      })
    } else {
      this.dateselected = moment().add(1, 'days').format("YYYY-MM-DD");
    }
    cos.getAppSign = (cb) => {
      this.ajax(this.apiUrl + 'su/cossign').then((res) => {
        cb(res.data)
      })
    }
  }

}
</script>
