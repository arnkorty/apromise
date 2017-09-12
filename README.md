## 简单 primose 实现

### 使用
```javacript
aPromise.resolve().then(function(){ 
  console.log('test resolve')
}).then(function(){
  console.log('test then')
})
# test resolve
# test then

// 延时执行
new aPromise(function(resolve){
  console.log('测试延时执行')
  setTimeout(resolve, 3000)
}).then(function(){
  console.log('我延时了3s 执行')
}).then(function(){
  console.log('延时执行成功')
})
# 测试延时执行
# 我延时了3s 执行
# 延时执行成功

// rejected
aPromise.rejected().then(function(){
  console.log('不执行')
}).catch(function(){
  console.log('catch 执行成功')
}).then(function(){
  console.log('then 中测试 rejcted 执行');
  throw new Error('rejected 执行成功')
}).catch(function(e){
  console.log(e.message)
})
# catch 执行成功
# then 中测试 rejcted 执行
# rejected 执行成功

```
