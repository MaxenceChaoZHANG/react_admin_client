import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

/*
添加分类的form组件
 */
export default class AddForm extends Component {

  formRef = React.createRef();

  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    categorys: PropTypes.array.isRequired, // 一级分类的数组
    parentId: PropTypes.string.isRequired, // 父分类的ID
  }

  UNSAFE_componentWillMount () {
    this.props.setForm(this.formRef)
  }

  render() {
    const {categorys, parentId} = this.props
    return (
      <Form ref={this.formRef}>
        {/*initialValue 与Option中的value对应  */}
        <Item name ='parentId' initialValue={parentId}>
              <Select >
                <Option value='0' key='0'>一级分类</Option>
                {
                  categorys.map((c,index )=> <Option value={c._id} key={index+1}>{c.name}</Option>)
                }
              </Select>
        </Item>

        <Item name='categoryName' initialValue= '' placeholder='请输入分类名称'  
                 rules={[{required: true, message: '分类名称必须输入'}]}>
              <Input />
        </Item>
      </Form>
    )
  }
}
