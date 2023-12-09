<template>
  <el-breadcrumb separator="/" v-if="breadList">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

    <el-breadcrumb-item>{{ breadList[0]}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ breadList[1] }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang='ts'>
    import {breadList} from '../../hooks/breadHooks.ts'
    // console.log(breadList)
</script>

<style>

</style>