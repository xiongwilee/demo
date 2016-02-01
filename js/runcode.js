function runCode(ele)  {
	var cod=document.all(ele)
	var code=cod.value;
	if (code!=""){
		var newwin=window.open('','','');  //打开一个窗口并赋给变量newwin。
		newwin.opener = null // 防止代码对论谈页面修改
		newwin.document.write(code);  //向这个打开的窗口中写入代码code，这样就实现了运行代码功能。
		newwin.document.close();
	}
}