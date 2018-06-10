#### restapi 前端程序调用流程
1. 进入首页后前端应该直接调用api/itemlist显示全部的物品，若用户已不再session有效期内，则提示用户登录
2. 此时前端应调用api/logIn，提交用户信息，服务器校验成功后会创建session,此时前端已经取得了权限，应该再次调用itemlist。
3. 若用户需要注册，前端应调用api/signUp，提交用户注册信息，注册成功后，前端应重复步骤2
4. 若调用api/itemlist，服务器返回“应该插入一条数据时”，此时则说明数据库还没有该用户的文档，前端应在界面显示addfirstitem按钮，用户点击后会调用api/addfirstitem，服务器会在数据库创建一个用户专属的文档，并插入一条用户提交的数据。
5. 若调用api/itemlist, 服务器返回了数据，此时，前端应开启“api/addnewitem”,“api/updateItemQuantity”，“api/deleteitem”等api接口
6. 当然，前端对于登录用户，应该开启api/signOut接口，方便用户登出，用户登出时，服务器会清除session，此时用户没有查询数据的权限，返回步骤1.
