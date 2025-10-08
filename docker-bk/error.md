6a30742623e4:/var/www/html# php artisan migrate --seed

   ErrorException 

  Array to string conversion

  at vendor/laravel/framework/src/Illuminate/Database/Schema/Builder.php:163
    159▕      * @return bool
    160▕      */
    161▕     public function hasTable($table)
    162▕     {
  ➜ 163▕         $table = $this->connection->getTablePrefix().$table;
    164▕ 
    165▕         foreach ($this->getTables(false) as $value) {
    166▕             if (strtolower($table) === strtolower($value['name'])) {
    167▕                 return true;

      +22 vendor frames 

  23  artisan:24
      Illuminate\Foundation\Console\Kernel::handle(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))

6a30742623e4:/var/www/html# php artisan storage:link


CROS問題
nginx_web    | 192.168.65.1 - - [07/Oct/2025:22:43:01 +0000] "OPTIONS /api/login HTTP/1.1" 204 0 "http://localhost:3000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36" "-"
nginx_web    | 192.168.65.1 - - [07/Oct/2025:22:43:07 +0000] "OPTIONS /api/register HTTP/1.1" 204 0 "http://localhost:3000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36" "-"

login:1 Access to XMLHttpRequest at 'http://localhost:8000/api/login' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.Understand this error
Login.js:26  POST http://localhost:8000/api/login net::ERR_FAILED
dispatchXhrRequest @ xhr.js:198
xhr @ xhr.js:15
dispatchRequest @ dispatchRequest.js:51
_request @ Axios.js:185
request @ Axios.js:40
httpMethod @ Axios.js:224
wrap @ bind.js:5
handleSubmit @ Login.js:26
executeDispatch @ react-dom-client.development.js:19116
runWithFiberInDEV @ react-dom-client.development.js:870
processDispatchQueue @ react-dom-client.development.js:19165
(anonymous) @ react-dom-client.development.js:19767
batchedUpdates$1 @ react-dom-client.development.js:3255
dispatchEventForPluginEventSystem @ react-dom-client.development.js:19320
dispatchEvent @ react-dom-client.development.js:23584
dispatchDiscreteEvent @ react-dom-client.development.js:23552
<form>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:327
Login @ Login.js:40
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:870
performUnitOfWork @ react-dom-client.development.js:17639
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16498
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Login>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:327
App @ App.js:77
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:870
performUnitOfWork @ react-dom-client.development.js:17639
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16498
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<App>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:327
./src/index.js @ index.js:8
options.factory @ react refresh:37
__webpack_require__ @ bootstrap:22
(anonymous) @ startup:7
(anonymous) @ startup:7Understand this error
register:1 Access to XMLHttpRequest at 'http://localhost:8000/api/register' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.Understand this error
Register.js:38 登録エラー: AxiosError {message: 'Network Error', name: 'AxiosError', code: 'ERR_NETWORK', config: {…}, request: XMLHttpRequest, …}
handleSubmit @ Register.js:38
await in handleSubmit
executeDispatch @ react-dom-client.development.js:19116
runWithFiberInDEV @ react-dom-client.development.js:870
processDispatchQueue @ react-dom-client.development.js:19165
(anonymous) @ react-dom-client.development.js:19767
batchedUpdates$1 @ react-dom-client.development.js:3255
dispatchEventForPluginEventSystem @ react-dom-client.development.js:19320
dispatchEvent @ react-dom-client.development.js:23584
dispatchDiscreteEvent @ react-dom-client.development.js:23552
<form>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:327
Register @ Register.js:61
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:870
performUnitOfWork @ react-dom-client.development.js:17639
workLoopConcurrentByScheduler @ react-dom-client.development.js:17634
renderRootConcurrent @ react-dom-client.development.js:17615
performWorkOnRoot @ react-dom-client.development.js:16498
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<Register>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:327
App @ App.js:81
react_stack_bottom_frame @ react-dom-client.development.js:25904
renderWithHooksAgain @ react-dom-client.development.js:7762
renderWithHooks @ react-dom-client.development.js:7674
updateFunctionComponent @ react-dom-client.development.js:10166
beginWork @ react-dom-client.development.js:11778
runWithFiberInDEV @ react-dom-client.development.js:870
performUnitOfWork @ react-dom-client.development.js:17639
workLoopSync @ react-dom-client.development.js:17469
renderRootSync @ react-dom-client.development.js:17450
performWorkOnRoot @ react-dom-client.development.js:16498
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:18957
performWorkUntilDeadline @ scheduler.development.js:45
<App>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:327
./src/index.js @ index.js:8
options.factory @ react refresh:37
__webpack_require__ @ bootstrap:22
(anonymous) @ startup:7
(anonymous) @ startup:7Understand this error
Register.js:34  POST http://localhost:8000/api/register net::ERR_FAILED