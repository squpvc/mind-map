<template>
  <div class="doc">
    {{ $t('doc.documentHasBeenMigrated') }} <a href="https://wanglin2.github.io/mind-map-docs/">{{ $t('doc.newAddress') }}</a>
  </div>
</template>

<style lang="less" scoped>
.doc {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;

  a {
    color: #1ea59a;
  }
}
</style>
