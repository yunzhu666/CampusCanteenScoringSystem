// 校园食堂评分系统 - JavaScript逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('evaluationDate').value = today;
    
    // 初始化所有滑块的值显示
    initializeSliders();
    
    // 为所有滑块添加事件监听
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', updateSliderValue);
        slider.addEventListener('input', updateCategoryScore);
    });
    
    // 为扣分项添加事件监听
    const penaltyCheckboxes = document.querySelectorAll('.penalty-option input[type="checkbox"]');
    penaltyCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePenaltyScore);
    });
    
    // 计算总分按钮
    document.getElementById('calculateBtn').addEventListener('click', calculateTotalScore);
    
    // 重置表单
    document.querySelector('form').addEventListener('reset', function() {
        setTimeout(() => {
            initializeSliders();
            updateAllCategoryScores();
            updatePenaltyScore();
            document.getElementById('resultSection').style.display = 'none';
        }, 10);
    });
});

// 初始化滑块值显示
function initializeSliders() {
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        const valueSpan = slider.parentElement.querySelector('.slider-value');
        if (valueSpan) {
            valueSpan.textContent = slider.value;
        }
    });
}

// 更新滑块值显示
function updateSliderValue(event) {
    const slider = event.target;
    const valueSpan = slider.parentElement.querySelector('.slider-value');
    if (valueSpan) {
        valueSpan.textContent = slider.value;
    }
}

// 更新分类得分
function updateCategoryScore() {
    // 计算每个分类的总分
    const categories = [1, 2, 3, 4, 5, 6];
    
    categories.forEach(category => {
        const sliders = document.querySelectorAll(`.slider[data-category="${category}"]`);
        let total = 0;
        
        sliders.forEach(slider => {
            total += parseInt(slider.value);
        });
        
        // 更新分类得分显示
        const categoryScoreElement = document.getElementById(`category${category}Score`);
        if (categoryScoreElement) {
            const maxScores = [30, 15, 15, 10, 15, 15];
            categoryScoreElement.textContent = `${total}/${maxScores[category-1]}`;
        }
    });
}

// 更新所有分类得分
function updateAllCategoryScores() {
    updateCategoryScore();
}

// 更新扣分得分
function updatePenaltyScore() {
    const checkboxes = document.querySelectorAll('.penalty-option input[type="checkbox"]:checked');
    let penaltyTotal = 0;
    
    checkboxes.forEach(checkbox => {
        penaltyTotal += parseInt(checkbox.value);
    });
    
    // 限制最大扣分10分
    penaltyTotal = Math.min(penaltyTotal, 10);
    
    document.getElementById('penaltyScore').textContent = penaltyTotal;
    return penaltyTotal;
}

// 计算总分
function calculateTotalScore() {
    // 验证表单
    const canteenName = document.getElementById('canteenName').value.trim();
    if (!canteenName) {
        alert('请输入食堂名称！');
        document.getElementById('canteenName').focus();
        return;
    }
    
    // 计算各部分得分
    const categoryScores = [];
    let totalScore = 0;
    
    for (let i = 1; i <= 6; i++) {
        const sliders = document.querySelectorAll(`.slider[data-category="${i}"]`);
        let categoryTotal = 0;
        
        sliders.forEach(slider => {
            categoryTotal += parseInt(slider.value);
        });
        
        categoryScores.push(categoryTotal);
        totalScore += categoryTotal;
    }
    
    // 计算扣分
    const penaltyScore = updatePenaltyScore();
    
    // 第六部分减去扣分
    totalScore -= penaltyScore;
    
    // 确保总分不低于0
    totalScore = Math.max(0, totalScore);
    
    // 更新结果显示
    updateResultDisplay(canteenName, categoryScores, penaltyScore, totalScore);
    
    // 显示结果区域
    document.getElementById('resultSection').style.display = 'block';
    
    // 滚动到结果区域
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

// 更新结果显示
function updateResultDisplay(canteenName, categoryScores, penaltyScore, totalScore) {
    // 更新基本信息
    document.getElementById('canteenResultName').textContent = canteenName;
    document.getElementById('evaluationResultDate').textContent = 
        `评价日期：${document.getElementById('evaluationDate').value}`;
    
    // 更新总分
    document.getElementById('finalScore').textContent = totalScore;
    
    // 更新各部分得分明细
    const maxScores = [30, 15, 15, 10, 15, 15];
    for (let i = 0; i < 6; i++) {
        document.getElementById(`breakdown${i+1}`).textContent = 
            `${categoryScores[i]}/${maxScores[i]}`;
    }
    
    // 更新扣分
    document.getElementById('breakdownPenalty').textContent = `-${penaltyScore}`;
    
    // 确定等级和评价
    const gradeInfo = getGradeInfo(totalScore);
    
    // 更新等级显示
    const gradeText = document.getElementById('gradeText');
    gradeText.textContent = gradeInfo.grade;
    gradeText.className = 'grade-badge ' + gradeInfo.className;
    
    // 更新评价文本
    updateEvaluationText(canteenName, totalScore, gradeInfo, categoryScores, penaltyScore);
}

// 获取等级信息
function getGradeInfo(score) {
    if (score >= 90) {
        return {
            grade: '卓越食堂',
            className: 'grade-excellent'
        };
    } else if (score >= 80) {
        return {
            grade: '优秀食堂',
            className: 'grade-good'
        };
    } else if (score >= 70) {
        return {
            grade: '达标食堂',
            className: 'grade-average'
        };
    } else if (score >= 60) {
        return {
            grade: '待改进食堂',
            className: 'grade-poor'
        };
    } else {
        return {
            grade: '不合格食堂',
            className: 'grade-fail'
        };
    }
}

// 更新评价文本（夸张的评价系统）
function updateEvaluationText(canteenName, totalScore, gradeInfo, categoryScores, penaltyScore) {
    const evaluationText = document.getElementById('evaluationText');
    let text = '';
    
    // 根据总分生成夸张评价
    if (totalScore >= 90) {
        text = `
            <p><strong>哇塞！${canteenName}简直是食堂界的爱马仕！</strong></p>
            <p>这食堂简直绝了！食材新鲜得像刚从地里摘的，厨师手艺堪比米其林大厨，价格还这么良心！</p>
            <p>环境干净得可以在地上打滚，服务态度好到让人怀疑是不是在五星级酒店！</p>
            <p>强烈建议全校师生都来这里吃饭，这简直是校园生活的幸福源泉！</p>
        `;
    } else if (totalScore >= 80) {
        text = `
            <p><strong>不错不错！${canteenName}是校园里的宝藏食堂！</strong></p>
            <p>饭菜味道相当可以，价格也合理，环境整洁舒适，服务态度也不错。</p>
            <p>偶尔来点新菜品就更完美了，继续保持这个水准，绝对是校园餐饮的标杆！</p>
            <p>推荐给所有同学，不会踩雷的好选择！</p>
        `;
    } else if (totalScore >= 70) {
        text = `
            <p><strong>嗯...${canteenName}还算过得去。</strong></p>
            <p>饭菜能吃，价格能接受，环境也还行，就是没什么亮点。</p>
            <p>属于那种"饿了就去吃，不饿也不会特意去"的食堂。</p>
            <p>建议食堂多听听学生意见，改进一下菜品多样性，提升空间还很大！</p>
        `;
    } else if (totalScore >= 60) {
        text = `
            <p><strong>啊这...${canteenName}需要好好改进啊！</strong></p>
            <p>饭菜味道一般般，价格还有点小贵，环境和服务都马马虎虎。</p>
            <p>属于"实在没得选了才去吃"的类型，吃完不会有什么幸福感。</p>
            <p>食堂管理方得加把劲了，不然学生都要跑光了！</p>
        `;
    } else {
        text = `
            <p><strong>拉爆了！${canteenName}这能吃得下去饭？</strong></p>
            <p>我的天呐！这食堂是在开玩笑吗？食材不新鲜，味道奇怪，价格还死贵！</p>
            <p>环境脏乱差，服务态度恶劣，各种不合理规定一大堆！</p>
            <p>强烈建议学校相关部门介入调查，这食堂简直是在挑战学生的忍耐极限！</p>
            <p>同学们，珍爱生命，远离此食堂！</p>
        `;
    }
    
    // 添加针对低分项的特别吐槽
    const lowCategories = [];
    const categoryNames = [
        '食品品质与安全',
        '价钱与性价比', 
        '多样性 & 营养搭配',
        '环境与设施',
        '服务与运营',
        '制度与包容性'
    ];
    
    for (let i = 0; i < categoryScores.length; i++) {
        const maxScore = [30, 15, 15, 10, 15, 15][i];
        if (categoryScores[i] < maxScore * 0.5) { // 得分低于满分的一半
            lowCategories.push(categoryNames[i]);
        }
    }
    
    if (lowCategories.length > 0 && totalScore < 80) {
        text += `<p><strong>特别需要改进的方面：</strong>${lowCategories.join('、')}。这些方面严重拖了后腿！</p>`;
    }
    
    // 如果有扣分项，添加特别提醒
    if (penaltyScore > 0) {
        text += `
            <div style="background: #fff5f5; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; border-left: 4px solid #e53e3e;">
                <p><strong><i class="fas fa-exclamation-triangle"></i> 【亟待整改的突出问题】</strong></p>
                <p>本次评估发现，食堂存在不合理规定。这些规定严重影响了用餐者的生理舒适与心理尊严，缺乏必要性和人性化考量，引发了师生的普遍反感。</p>
                <p><strong>建议：</strong> 立即废除不合理规定，确保所有师生拥有正常就餐的基本权利。食堂管理应秉持服务初衷，任何规定的制定都应以提升就餐体验、保障健康为前提。</p>
            </div>
        `;
    }
    
    // 添加最终建议
    if (totalScore < 60) {
        text += `
            <p style="margin-top: 1rem; color: #e53e3e; font-weight: bold;">
                <i class="fas fa-skull-crossbones"></i> 警告：此食堂已被评为"不合格食堂"，强烈建议学校管理层立即进行整改！
            </p>
        `;
    } else if (totalScore < 70) {
        text += `
            <p style="margin-top: 1rem; color: #ed8936; font-weight: bold;">
                <i class="fas fa-exclamation-circle"></i> 提示：此食堂处于"待改进"状态，建议在一个月内进行复查评估。
            </p>
        `;
    }
    
    evaluationText.innerHTML = text;
}

// 初始化所有分类得分显示
updateAllCategoryScores();