<template>
  <div class="contain">{{text}}</div>
</template>

<script>
export default {
  data() {
    return {
      text: "a vue component"
    };
  }
};
</script>

<style lang="less">
.contain {
  color: green;
}
</style>
