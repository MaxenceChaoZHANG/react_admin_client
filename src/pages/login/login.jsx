import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

// const Item = Form.Item // 不能写在import之前

/*
登陆的路由组件
 */
export default class Login extends Component {

  onFinish = async values => {
    console.log('Received values of form: ', values);
    const { username, password } = values
    const result =  await reqLogin(username, password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
    if (result.status === 0) { // 登陆成功
      // 提示登陆成功
      message.success('登陆成功')
      const user=result.data
      // 保存user
      memoryUtils.user = user // 保存在内存中
      storageUtils.saveUser(user) // 保存到local中
      // 跳转到管理界面 (不需要再回退回到登陆)
      this.props.history.replace('/')
    } else { // 登陆失败
      // 提示错误信息
      message.error(result.msg)
    }
    // 阻止事件的默认行为
    // event.preventDefault()
  }

  /*
  对密码进行自定义验证
  */
  /*
   用户名/密码的的合法性要求
     1). 必须输入
     2). 必须大于等于4位
     3). 必须小于等于12位
     4). 必须是英文、数字或下划线组成
    */
  validatePwd = (rule, value)=> {
    // console.log('validatePwd()', rule, value)
    if (!value) {
      return Promise.reject('密码必须输入')
    } else if (value.length < 4) {
      return Promise.reject('密码长度不能小于4位')
    } else if (value.length > 12) {
      return Promise.reject('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return Promise.reject('密码必须是英文、数字或下划线组成')
    } else {
      // console.log('验证通过')
      return Promise.resolve() // 验证通过
    }
    // callback('xxxx') // 验证失败, 并指定提示的文本
  }

  render() {

    //如果用户已经登陆, 自动跳转到管理界面
    const user = memoryUtils.user
    if(user && user._id) {
      return <Redirect to='/'/>
    }

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form name="normal_login" className="login-form" onFinish={this.onFinish} >

            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' },
            { min: 4, message: '用户名不能少于4位' },
            { max: 12, message: '用户名不能多于12位' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含数字、字母、下划线' }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
            </Form.Item>

            <Form.Item name="password" rules={[{ validator: this.validatePwd }]}>
              <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button"> 登录 </Button>
            </Form.Item>
          </Form>
        </section>

      </div>

    )
  }
}

/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */
/*
包装Form组件生成一个新的组件: Form(Login)
新组件会向Form组件传递一个强大的对象属性: form
 */
// const WrapLogin = Form.create()(Login)
// export default WrapLogin
/*
1. 前台表单验证
2. 收集表单输入数据
 */

/*
async和await
1. 作用?
   简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
   以同步编码(没有回调函数了)方式实现异步流程
2. 哪里写await?
    在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
 */