// Mock Data representing CUSTOMERS
const CUSTOMERS = {
    "900101-1234567": {
        name: "김현대",
        rrn: "910101-1234567",
        insurance_age: 33,
        gender: "남",
        job: "경영사무직 / 1급",
        consent: "동의",
        consent_end: "2026-12-11",
        contract_summary: {
            "현대해상": ["3건", "120,000원"],
            "손해보험": ["2건", "210,000원"],
            "생명보험": ["5건", "95,000원"],
            "기타": ["1건", "30,000원"]
        },
        history: [
            ["가입이력", "실손보험 가입(2022-05-01)"],
            ["가입이력", "건강보험 가입(2024-09-15)"],
            ["기왕력", "위염 치료 이력(경증, 완치)"],
            ["기왕력", "최근 5년 내 입원 없음"],
            ["기왕력", "3개월 내 추가 검사 없음"],
            ["기왕력", "혈압/당뇨 추가 고지사항 없음"],
            ["기가입", "운전자 특약 유지 중"]
        ],
        products: [
            "1순위  표준 2Q PASS",
            "2순위  퍼펙트종합(10년고지)",
            "3순위  내삶N(3.99)",
            "4순위  2Q PASS 내삶N(3.88)",
            "5순위  실속건강플랜"
        ],
        plans: [
            ["AI", "고객 개인화 추천", 1, "고객명", generatePlanId(), "표준 2Q PASS", "2026-05-15", "80,160", "20.8", "할증, 부담보", ""],
            ["AI", "베테랑 설계 따라하기", 2, "고객명", generatePlanId(), "퍼펙트 종합(10년고지)", "2026-05-15", "166,900", "14.5", "정상", ""],
            ["AI", "우리 지점 트렌드", 3, "고객명", generatePlanId(), "내삶엔 3.9.9.9", "2026-05-15", "151,950", "19.7", "누적조정", "메모"]
        ]
    },
    "900101-1000000": {
        name: "이샘플",
        rrn: "900101-1000000",
        insurance_age: 36,
        gender: "남",
        job: "사무직 / 1급",
        consent: "동의",
        consent_end: "2026-12-11",
        contract_summary: {
            "현대해상": ["1건", "89,000원"],
            "손해보험": ["1건", "110,000원"],
            "생명보험": ["2건", "72,000원"],
            "기타": ["0건", "0원"]
        },
        history: [
            ["가입이력", "운전자보험 가입(2023-03-04)"],
            ["기왕력", "알레르기 비염 통원 치료"],
            ["기왕력", "최근 2년 수술 이력 없음"],
            ["기왕력", "최근 3개월 약 처방 이력 없음"]
        ],
        products: [
            "1순위  원클릭 종합플랜",
            "2순위  실속 간편플랜",
            "3순위  표준 건강플랜",
            "4순위  운전자 결합플랜"
        ],
        plans: [
            ["AI", "고객 개인화 추천", 1, "이샘플", generatePlanId(), "원클릭 종합", "2026-05-07", "74,300", "15.2", "정상", ""],
            ["AI", "베테랑 설계 따라하기", 2, "이샘플", generatePlanId(), "실속 간편", "2026-05-07", "99,100", "13.8", "정상", ""],
            ["AI", "우리 지점 트렌드", 3, "이샘플", generatePlanId(), "운전자 결합", "2026-05-07", "121,500", "11.2", "부담보", "메모"]
        ]
    }
};

function generatePlanId() {
    return "L026" + Math.floor(10000000 + Math.random() * 90000000).toString();
}

let currentCustomer = null;
let isPreliminary = false; // 가설계 모드 여부

// DOM Elements
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screenTitle = document.getElementById('screen-title');
const rrnInput = document.getElementById('rrn-input');

// Screen 2 Data Elements
const custNameTitle = document.getElementById('cust-name-title');
const custInfoText = document.getElementById('cust-info-text');
const summaryGrid = document.getElementById('summary-grid');
const productList = document.getElementById('product-list');
const historyTbody = document.getElementById('history-tbody');
const planTbody = document.getElementById('plan-tbody');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Search Buttons
    document.getElementById('search-btn-icon').addEventListener('click', lookupCustomer);
    document.getElementById('search-btn-main').addEventListener('click', lookupCustomer);
    
    // AI Button
    document.getElementById('run-ai-btn').addEventListener('click', runAiDesign);
    
    // Close / Back Button
    document.getElementById('close-btn').addEventListener('click', () => {
        showScreen(1);
    });

    // Handle Enter Key in input
    rrnInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            lookupCustomer();
        }
    });

    // Modal Close
    document.getElementById('modal-close-btn').addEventListener('click', hideModal);

    // Type Select Modal buttons
    document.getElementById('type-illness-btn').addEventListener('click', () => {
        hideTypeSelectModal();
        generatePreliminaryPlans('유병자');
    });
    document.getElementById('type-standard-btn').addEventListener('click', () => {
        hideTypeSelectModal();
        generatePreliminaryPlans('표준형');
    });

    // Custom Design Modal buttons
    document.getElementById('cd-close-btn').addEventListener('click', hideCustomDesignModal);
    document.getElementById('cd-submit-btn').addEventListener('click', submitCustomDesign);
    
    // Plan Detail Modal close button
    document.getElementById('pd-close-btn').addEventListener('click', hidePlanDetailModal);

    // Audit Modal buttons
    document.getElementById('btn-audit-view').addEventListener('click', showAuditModal);
    document.getElementById('audit-close-btn').addEventListener('click', hideAuditModal);

    // 태아보험 라디오 토글
    const productRadios = document.querySelectorAll('input[name="product"]');
    productRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('prenatal-options').style.display = (e.target.value === '태아보험') ? 'block' : 'none';
        });
    });
});

function showScreen(screenNum) {
    if (screenNum === 1) {
        screen1.classList.add('active');
        screen2.classList.remove('active');
        screenTitle.innerText = "1. 도입_고객정보 입력";
        currentCustomer = null;
        
        // Reset plans
        planTbody.innerHTML = '<tr class="empty-row"><td colspan="11">AI 설계를 실행해주세요.</td></tr>';
        resetStepper();
    } else {
        screen1.classList.remove('active');
        screen2.classList.add('active');
        screenTitle.innerText = "2. 설계 요청(동의고객)";
    }
}

function showAlert(title, message) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    document.getElementById('alert-modal').classList.add('show');
}

function hideModal() {
    document.getElementById('alert-modal').classList.remove('show');
}

function lookupCustomer() {
    const rrn = rrnInput.value.trim();
    
    // 가설계 판별: "900101-1" 또는 "9001011" 형태 (6자리 생년월일 + 성별 1자리)
    const prelimMatch = rrn.match(/^(\d{6})-?([12])$/);
    
    if (prelimMatch) {
        // 가설계 모드
        isPreliminary = true;
        const birthStr = prelimMatch[1];
        const genderCode = prelimMatch[2];
        const gender = genderCode === '1' ? '남' : '여';
        const grade = document.getElementById('grade-input').value;
        
        // 생년월일에서 보험나이 계산 (간이)
        const birthYear = parseInt(birthStr.substring(0, 2));
        const fullYear = birthYear >= 50 ? 1900 + birthYear : 2000 + birthYear;
        const age = new Date().getFullYear() - fullYear;
        
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        
        currentCustomer = {
            name: "가설계고객",
            rrn: rrn,
            insurance_age: age,
            gender: gender,
            grade: grade,
            job: `미확인 / ${grade}급`,
            consent: "미동의 (가설계)",
            consent_end: "-",
            contract_summary: {
                "현대해상": ["- 건", "- 원"],
                "손해보험": ["- 건", "- 원"],
                "생명보험": ["- 건", "- 원"],
                "기타": ["- 건", "- 원"]
            },
            history: [],
            products: [
                "1순위  표준 2Q PASS",
                "2순위  퍼펙트종합(10년고지)",
                "3순위  내삶엔 3.9.9.9"
            ],
            plans: [],
            _birthStr: birthStr,
            _dateStr: dateStr
        };
        
        populateCustomer(currentCustomer);
        applyPreliminaryMode(true);
        showScreen(2);
        return;
    }
    
    // 일반 고객 조회
    const customer = CUSTOMERS[rrn];
    
    if (!customer) {
        showAlert("조회 결과", "샘플 데이터가 없습니다.\n\n• 동의고객: 900101-1234567 또는 900101-1000000\n• 가설계: 생년월일6자리-성별1자리 (예: 900101-1)");
        return;
    }
    
    isPreliminary = false;
    currentCustomer = customer;
    populateCustomer(customer);
    applyPreliminaryMode(false);
    showScreen(2);
}

function applyPreliminaryMode(isPrelim) {
    const customRadio = document.getElementById('custom-ai-radio');
    const customOption = document.getElementById('custom-ai-option');
    const oneClickRadio = document.querySelector('input[value="원클릭AI설계(종합보험)"]');
    
    if (isPrelim) {
        // 맞춤 AI설계 비활성화
        customRadio.disabled = true;
        customRadio.checked = false;
        customOption.classList.add('disabled');
        oneClickRadio.checked = true;
        
        // 스크린 타이틀 변경
        screenTitle.innerText = "2. 설계 요청(가설계고객)";
    } else {
        // 맞춤 AI설계 활성화
        customRadio.disabled = false;
        customOption.classList.remove('disabled');
        oneClickRadio.checked = true;
        
        screenTitle.innerText = "2. 설계 요청(동의고객)";
    }
}

function populateCustomer(customer) {
    // Header
    custNameTitle.innerText = `${customer.name}  ${customer.rrn}`;
    
    // Info text
    let infoHtml = `나이/성별 : ${customer.insurance_age}세 (${customer.gender})`;
    if (customer.grade) {
        infoHtml += ` &nbsp;|&nbsp; <strong style="color: var(--primary);">${customer.grade}급</strong>`;
    }
    infoHtml += `<br>
        직업정보 : ${customer.job}<br>
        개인정보 동의여부 : ${customer.consent}<br>
        동의종료일 : ${customer.consent_end}
    `;
    custInfoText.innerHTML = infoHtml;
    
    // Summary
    summaryGrid.innerHTML = '';
    const companies = ["현대해상", "손해보험", "생명보험", "기타"];
    companies.forEach(company => {
        const data = customer.contract_summary[company] || ["0건", "0원"];
        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `
            <div class="label">${company}</div>
            <div class="value">${data[0]}<br>${data[1]}</div>
        `;
        summaryGrid.appendChild(div);
    });
    
    // Products
    productList.innerHTML = '';
    customer.products.forEach(prod => {
        const li = document.createElement('li');
        li.innerText = prod;
        productList.appendChild(li);
    });
    
    // History
    historyTbody.innerHTML = '';
    if (customer.history.length === 0) {
        historyTbody.innerHTML = '<tr><td colspan="2" style="padding: 20px; color: #999; font-style: italic;">가설계 - 이력 정보 없음</td></tr>';
    } else {
        customer.history.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span style="background: #f0f4f8; padding: 4px 8px; border-radius: 4px; font-size:12px; color: #2d6a9f; font-weight: 600;">${row[0]}</span></td>
                <td style="text-align: left; font-weight: 500;">${row[1]}</td>
            `;
            historyTbody.appendChild(tr);
        });
    }
}

function runAiDesign() {
    if (!currentCustomer) {
        showAlert("안내", "먼저 고객 조회를 해주세요.");
        return;
    }
    
    // 가설계 모드면 유형 선택 모달 표시
    if (isPreliminary) {
        showTypeSelectModal();
        return;
    }

    // 맞춤 AI설계 선택되었는지 확인
    const designType = document.querySelector('input[name="design_type"]:checked');
    if (designType && designType.value === '맞춤 AI설계') {
        showCustomDesignModal();
        return;
    }
    
    // 원클릭 AI설계: 바로 플랜 표시
    renderPlans(currentCustomer.plans);
    
    // Update Stepper
    document.getElementById('ai-review-step').classList.remove('active', 'highlight');
    document.getElementById('ai-review-step').classList.add('active');
    document.getElementById('compare-step').classList.add('active', 'highlight');
    
    showAlert("AI 설계 완료", `AI 원클릭 설계 결과로 ${currentCustomer.plans.length}개의 계약안이 생성되었습니다.`);
}

function generatePreliminaryPlans(type) {
    const birthStr = currentCustomer._birthStr;
    const dateStr = currentCustomer._dateStr;
    let productName, plans;
    
    if (type === '유병자') {
        productName = "간편 3.10.10";
        plans = [
            ["AI", "고객 개인화 추천", 1, "가설계고객", generatePlanId(), productName, dateStr, "85,300", "19.4", "가심사", ""],
            ["AI", "베테랑 설계 따라하기", 2, "가설계고객", generatePlanId(), productName, dateStr, "112,600", "16.8", "가심사", ""],
            ["AI", "우리 지점 트렌드", 3, "가설계고객", generatePlanId(), productName, dateStr, "97,400", "18.1", "가심사", ""]
        ];
    } else {
        productName = "퍼펙트 플러스";
        plans = [
            ["AI", "고객 개인화 추천", 1, "가설계고객", generatePlanId(), productName, dateStr, "78,500", "18.2", "가심사", ""],
            ["AI", "베테랑 설계 따라하기", 2, "가설계고객", generatePlanId(), productName, dateStr, "145,200", "15.7", "가심사", ""],
            ["AI", "우리 지점 트렌드", 3, "가설계고객", generatePlanId(), productName, dateStr, "132,800", "17.1", "가심사", ""]
        ];
    }
    
    currentCustomer.plans = plans;
    renderPlans(plans);
    
    // Update Stepper
    document.getElementById('ai-review-step').classList.remove('active', 'highlight');
    document.getElementById('ai-review-step').classList.add('active');
    document.getElementById('compare-step').classList.add('active', 'highlight');
    
    showAlert("AI 설계 완료", `[${type}] ${productName} 기준으로\n3개의 가설계안이 생성되었습니다.`);
}

function renderPlans(plans) {
    planTbody.innerHTML = '';
    plans.forEach(plan => {
        const tr = document.createElement('tr');
        let html = '';
        plan.forEach((item, idx) => {
            if (idx === 9) {
                let color = '#28a745';
                if (item.includes('부담보') || item.includes('할증')) color = '#dc3545';
                else if (item.includes('조정')) color = '#fd7e14';
                else if (item.includes('가심사')) color = '#9b59b6';
                html += `<td><span style="color: ${color}; font-weight: 600;">${item}</span></td>`;
            } else if (idx === 1) {
                html += `<td><span style="background: #eef2f7; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; color: #233b69; white-space: nowrap;">${item}</span></td>`;
            } else if (idx === 4) {
                html += `<td><a class="plan-link" onclick='showPlanDetail(${JSON.stringify(plan).replace(/'/g, "&#39;")})'>${item}</a></td>`;
            } else {
                html += `<td>${item}</td>`;
            }
        });
        tr.innerHTML = html;
        planTbody.appendChild(tr);
    });
}

function showTypeSelectModal() {
    document.getElementById('type-select-modal').classList.add('show');
}

function hideTypeSelectModal() {
    document.getElementById('type-select-modal').classList.remove('show');
}

function showCustomDesignModal() {
    // 인기담보 라벨 업데이트
    if (currentCustomer) {
        const ageGroup = Math.floor(currentCustomer.insurance_age / 10) * 10;
        const label = document.getElementById('popular-label');
        label.textContent = `★ '${ageGroup}대 ${currentCustomer.gender}' 고객의 상위10개 질병담보`;
    }
    document.getElementById('custom-design-modal').classList.add('show');
}

function hideCustomDesignModal() {
    document.getElementById('custom-design-modal').classList.remove('show');
}

function submitCustomDesign() {
    // 선택된 상품 수집 (라디오 버튼)
    const selectedProduct = document.querySelector('input[name="product"]:checked')?.value;
    const selectedCoverages = Array.from(document.querySelectorAll('input[name="coverage"]:checked')).map(c => c.value);
    const selectedPremium = document.querySelector('input[name="premium"]:checked')?.value || '헬퍼추천';
    
    if (!selectedProduct) {
        hideCustomDesignModal();
        showAlert("안내", "상품 구분을 선택해주세요.");
        return;
    }
    
    // 상품명 결정
    let productName = "맞춤 종합플랜";
    if (selectedProduct === '종합보험_유병자') {
        productName = "맞춤 간편플랜";
    } else if (selectedProduct === '운전자보험') {
        productName = "맞춤 운전자플랜";
    } else if (selectedProduct === '간병치매보험') {
        productName = "맞춤 간병플랜";
    } else if (selectedProduct === '태아보험') {
        productName = "어린이Q";
    }
    
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const custName = currentCustomer.name;
    
    // 보험료 범위에 따른 금액 결정
    let premiums = ["95,400", "128,700", "156,200"];
    if (selectedPremium === '5만원이하') premiums = ["42,300", "38,100", "47,800"];
    else if (selectedPremium === '5~10만원') premiums = ["72,400", "85,600", "93,100"];
    else if (selectedPremium === '10~15만원') premiums = ["108,500", "125,300", "142,800"];
    else if (selectedPremium === '15만원초과') premiums = ["168,900", "185,200", "201,700"];
    
    const plans = [
        ["AI", "고객 개인화 추천", 1, custName, generatePlanId(), productName, dateStr, premiums[0], "17.5", "정상", ""],
        ["AI", "베테랑 설계 따라하기", 2, custName, generatePlanId(), productName, dateStr, premiums[1], "15.2", "정상", ""],
        ["AI", "우리 지점 트렌드", 3, custName, generatePlanId(), productName, dateStr, premiums[2], "13.8", "정상", ""]
    ];
    
    currentCustomer.plans = plans;
    
    hideCustomDesignModal();
    renderPlans(plans);
    
    // Update Stepper
    document.getElementById('ai-review-step').classList.remove('active', 'highlight');
    document.getElementById('ai-review-step').classList.add('active');
    document.getElementById('compare-step').classList.add('active', 'highlight');
    
    const coverageText = selectedCoverages.length > 0 ? selectedCoverages.slice(0, 3).join(', ') + (selectedCoverages.length > 3 ? ' 외 ' + (selectedCoverages.length - 3) + '건' : '') : '기본';
    showAlert("맞춤 AI 설계 완료", `[${productName}] 기준\n보험료: ${selectedPremium}\n주요담보: ${coverageText}\n\n3개의 맞춤 설계안이 생성되었습니다.`);
}

function resetStepper() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.className = 'step';
        if (index <= 2) step.classList.add('active', 'highlight');
        if (index === 0) step.classList.remove('highlight');
    });
}

function showPlanDetail(plan) {
    document.getElementById('pd-product-name').textContent = plan[5];
    document.getElementById('pd-plan-id').textContent = plan[4];
    document.getElementById('pd-premium').textContent = plan[7];
    document.getElementById('pd-audit-result').textContent = plan[9];
    
    const reasonType = plan[1];
    const titleEl = document.getElementById('pd-reason-title');
    const statEl = document.getElementById('pd-stat');
    const simEl = document.getElementById('pd-similarity');
    const prevSimEl = document.getElementById('pd-prev-sim');
    const descEl = document.querySelector('.pd-desc');
    
    // 태아보험/어린이보험 분기 처리
    const isPrenatal = plan[5].includes('어린이');

    if (isPrenatal) {
        document.getElementById('pd-sim-wrapper').style.display = 'none';
        document.getElementById('pd-prev-sim-wrapper').style.display = 'none';
        descEl.textContent = "고객님과 동일한 유형의 고객들이 가장 선호하는 표준 플랜 구성입니다.";
        
        if (reasonType === "고객 개인화 추천") {
            titleEl.textContent = "[설계 주제] 자사 최다 가입 표준 플랜";
            statEl.innerHTML = "당사 태아보험 가입 고객들이 <strong>가장 많이 선택하는</strong> 기본 표준 플랜입니다.";
        } else if (reasonType === "베테랑 설계 따라하기") {
            titleEl.textContent = "[설계 주제] 표준 플랜 + 우수 설계자 옵션";
            statEl.innerHTML = "표준 플랜에 <strong>우수 설계자들의 추천 특약</strong>이 추가된 든든한 구성입니다.";
        } else {
            titleEl.textContent = "[설계 주제] 표준 플랜 + 지점 인기 옵션";
            statEl.innerHTML = "표준 플랜에 최근 3개월 지점 내 <strong>가장 인기 있는 옵션</strong>이 추가된 구성입니다.";
        }
    } else {
        document.getElementById('pd-sim-wrapper').style.display = 'block';
        document.getElementById('pd-prev-sim-wrapper').style.display = 'block';
        descEl.textContent = "고객님의 가입정보를 기반 중 암/뇌/심 중증질환 기왕력 및 다빈도질환 이력이 비슷한 고객님들이 많이 가입한 상품 중 보장 자산이 많이 담긴 설계를 추천 드립니다.";

        if (reasonType === "고객 개인화 추천") {
            titleEl.textContent = "[설계 주제] 고객 맞춤 (유사고객)";
            statEl.innerHTML = "대장용종 병력을 가지고 있는 분들의 <strong>50.0%</strong>가 가입 중인 상품입니다.";
            simEl.textContent = "88.8%";
            prevSimEl.textContent = "75.4%";
        } else if (reasonType === "베테랑 설계 따라하기") {
            titleEl.textContent = "[설계 주제] 우수 설계 따라하기";
            statEl.innerHTML = "우수 플래너들이 가장 많이 설계한 <strong>Top 3</strong> 구성입니다.";
            simEl.textContent = "92.5%";
            prevSimEl.textContent = "81.2%";
        } else {
            titleEl.textContent = "[설계 주제] 최신 트렌드";
            statEl.innerHTML = "최근 3개월 지점 내 최다 판매를 기록한 <strong>인기 트렌드</strong> 상품입니다.";
            simEl.textContent = "85.2%";
            prevSimEl.textContent = "68.9%";
        }
    }
    
    document.getElementById('plan-detail-modal').classList.add('show');
}

function hidePlanDetailModal() {
    document.getElementById('plan-detail-modal').classList.remove('show');
}

function showAuditModal() {
    // Populate dynamic audit text from the plan detail modal's current value
    const auditText = document.getElementById('pd-audit-result').textContent;
    document.getElementById('audit-dynamic-result').innerHTML = auditText.replace(/,/g, '<br>');
    
    document.getElementById('audit-modal').classList.add('show');
}

function hideAuditModal() {
    document.getElementById('audit-modal').classList.remove('show');
}
