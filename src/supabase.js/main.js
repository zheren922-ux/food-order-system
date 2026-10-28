// 1. 初始化 Supabase 连接（已自动填入你的项目 URL 和 API Key）
const SUPABASE_URL = 'https://hyvucrvuvppmqwmbllhx.supabase.com';
const SUPABASE_ANON_KEY = 'sb_publishable_yr8WcSaae5gr11C_H-AJVg_bKczDwFt';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 获取页面上的元素
const tableDisplay = document.getElementById('tableDisplay');
const startBtn = document.getElementById('startBtn');
const checkBtn = document.getElementById('checkBtn');

// 2. 自动侦测桌号逻辑
function detectTableNumber() {
    const urlParams = new URLSearchParams(window.location.search);
    const tableNum = urlParams.get('table');

    if (tableNum) {
        tableDisplay.innerText = '当前桌位：Table ' + tableNum;
        sessionStorage.setItem('currentTable', tableNum);
    } else {
        tableDisplay.innerText = '未检测到桌号，请扫码点餐';
        tableDisplay.style.color = '#ff6b6b';
    }
}

// 网页加载完成后立刻侦测桌号
window.onload = detectTableNumber;

// 3. 点击 Start Ordering 按钮事件
startBtn.addEventListener('click', async () => {
    const tableNum = sessionStorage.getItem('currentTable');
    
    if(!tableNum) {
        alert("请使用微信/相机扫描桌上的专属二维码以获取桌号！");
        return;
    }

    // 更新按钮状态
    startBtn.innerText = "连接中...";
    startBtn.disabled = true;

    try {
        // 写入 Supabase 数据库的 orders 表
        const { data, error } = await supabase
            .from('orders')
            .insert([
                { 
                    table_number: parseInt(tableNum), // 将桌号作为数字存入
                    status: 'ordering' 
                }
            ]);

        if (error) throw error;

        alert("桌号 " + tableNum + " 已成功连接并写入数据库！准备进入菜单...");
        // window.location.href = "menu.html"; // 等之后建好 menu.html，把这行最前面的 // 删掉
        
    } catch (error) {
        alert("连接数据库失败：" + error.message);
        console.error(error);
    } finally {
        startBtn.innerText = "Start Ordering";
        startBtn.disabled = false;
    }
});

// 4. 点击 Check Ordering 按钮事件
checkBtn.addEventListener('click', () => {
    const tableNum = sessionStorage.getItem('currentTable');
    if(!tableNum) {
        alert("请先扫码获取桌号！");
        return;
    }
    alert("桌号 " + tableNum + " 准备跳转到订单查询页面...");
    // window.location.href = "order.html"; // 等之后建好 order.html，把这行最前面的 // 删掉
});