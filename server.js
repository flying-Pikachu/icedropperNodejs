var http    = require('http');
var url     = require('url');

/**
 * 简单配置个路由 用来检测无用的请求 仅符合路由规则的才能被接受
 * @type {{/: string, permission: string}}
 */
var route = {
    '/': "/",
    'permission': '/permission'
};

/**
 * 上述路由的简单判断规则
 * @param reqPath
 * @returns {boolean}
 */
var isValid = function (reqPath) {
    for (var key in route) {
        if (route[key] == reqPath) {
            return true;
        }
    }
    return false;
};

/**
 * 返回处理完成后的请求
 * @param permissions
 * @returns {JSON}
 */
function mapPermissionName(permissions) {

    const permissionMap = {
        "READ_INVENTORY_DASHBOARD": "商品统计查看",
        "READ_CONNECTION_DASHBOARD": "供应商统计查看",
        "MANAGE_DEPARTMENT": "部门管理",
        "MANAGE_USER": "员工管理"
    }

    const permissionTypeMap = {
        "DASHBOARD": "统计面板权限",
        "USER": "员工权限管理"
    }

    var resultMap = {};
    for(var key in permissions) {
        resultMap[key] = {'name':permissionTypeMap[key]};
        for (var key1 in permissions[key]) {
            resultMap[key]['permissions'] = [];
            for (var key2 in permissions[key][key1]) {
                var per = {'type':permissions[key][key1][key2], 'name':permissionMap[permissions[key][key1][key2]]};
                resultMap[key]['permissions'].push(per);
            }
        }
    }

    return resultMap;
}

http.createServer(function(request, response) {
    if (!isValid(url.parse(request.url).pathname)) {
        res.writeHead(404, {'Content-Type': 'text/plain;charset=utf-8'});
        res.write("{'errcode':404,'errmsg':'404 页面不见啦'}");
        res.end();
    } else {
        var pathname = url.parse(request.url).pathname;
        var permissions = url.parse(request.url, true).query;
        response.writeHead(200, {"Content-Type": "text/plain"});
        console.log(request.method)
        if (request.method.toUpperCase() == 'POST') {
            var postData = "";
            request.addListener("data", function (data) {
                postData += data;
            });
            request.addListener("end", function () {
                console.log(JSON.parse(postData));
                response.write(JSON.stringify(mapPermissionName(JSON.parse(postData))));
                response.end();
            });
        }
        else if (request.method.toUpperCase() == 'GET') {
            
        } else {
            //head put delete options etc.
        }
    }
  }).listen(8888, function () {
    console.log("listen on port 8888");
});