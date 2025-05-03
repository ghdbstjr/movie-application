document.addEventListener('DOMContentLoaded', () => {
    // 공통 요소
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const resultDiv = document.getElementById('search-result');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // 유효성 검사 함수
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => password.length >= 6;
    const validateUsername = (username) => /^[a-zA-Z0-9]{5,15}$/.test(username);

    // 검색 기능 변수
    let movies = [];
    let currentPage = 1;
    const itemsPerPage = 4;

    // --- 검색 기능 ---
    if (searchButton && searchInput && resultDiv) {
        searchButton.addEventListener('click', async () => {
            const query = searchInput.value.trim();
            if (!query) {
                alert('검색어를 입력하세요!');
                return;
            }

            try {
                const response = await fetch(`/tmdb/search?query=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('서버 응답 오류');
                const data = await response.json();
                movies = data.results;
                currentPage = 1;
                renderMovies();
                renderPagination();
            } catch (error) {
                console.error('검색 실패:', error);
                alert('검색 중 문제가 발생했습니다.');
            }
        });
    }

    function renderMovies() {
        resultDiv.innerHTML = '';
        if (movies.length === 0) {
            resultDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageItems = movies.slice(startIndex, startIndex + itemsPerPage);

        pageItems.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie-card';
            movieDiv.innerHTML = `
                ${movie.poster_path 
                    ? `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">`
                    : `<div style="width:200px; height:300px; background-color:lightgray; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:14px; color:#666;">No Image</div>`
                }
                <h3>${movie.title}</h3>
            `;
            resultDiv.appendChild(movieDiv);
        });
    }

    function renderPagination() {
        const totalPages = Math.ceil(movies.length / itemsPerPage);
        const paginationDiv = document.createElement('div');
        paginationDiv.style.textAlign = 'center';
        paginationDiv.style.marginTop = '10px';

        const prevButton = document.createElement('button');
        prevButton.textContent = '이전';
        prevButton.disabled = currentPage === 1;
        prevButton.style.margin = '0 5px';
        prevButton.onclick = () => {
            currentPage--;
            renderMovies();
            renderPagination();
        };

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `${currentPage} / ${totalPages}`;
        pageInfo.style.margin = '0 10px';

        const nextButton = document.createElement('button');
        nextButton.textContent = '다음';
        nextButton.disabled = currentPage === totalPages;
        nextButton.style.margin = '0 5px';
        nextButton.onclick = () => {
            currentPage++;
            renderMovies();
            renderPagination();
        };

        paginationDiv.append(prevButton, pageInfo, nextButton);
        resultDiv.appendChild(paginationDiv);
    }

    // --- 로그인 유효성 검사 ---
    if (loginForm) {
        const loginUsername = document.getElementById('login-username');
        const loginPassword = document.getElementById('login-password');
        const loginUsernameError = document.getElementById('login-username-error');
        const loginPasswordError = document.getElementById('login-password-error');

        loginForm.addEventListener('submit', (e) => {
            let isValid = true;
            loginUsernameError.textContent = '';
            loginPasswordError.textContent = '';

            if (!validateUsername(loginUsername.value)) {
                loginUsernameError.textContent = '유효한 아이디를 입력하세요.';
                isValid = false;
            }
            if (!validatePassword(loginPassword.value)) {
                loginPasswordError.textContent = '비밀번호는 6자 이상이어야 합니다.';
                isValid = false;
            }
            if (!isValid) e.preventDefault();
        });
    }

    // --- 회원가입 유효성 검사 ---
    if (signupForm) {
        const signupUsername = document.getElementById('signup-username');
        const signupPassword = document.getElementById('signup-password');
        const signupEmail = document.getElementById('signup-email');
        const signupUsernameError = document.getElementById('signup-username-error');
        const signupPasswordError = document.getElementById('signup-password-error');
        const signupEmailError = document.getElementById('signup-email-error');

        signupForm.addEventListener('submit', (e) => {
            let isValid = true;
            signupUsernameError.textContent = '';
            signupPasswordError.textContent = '';
            signupEmailError.textContent = '';

            if (!validateUsername(signupUsername.value)) {
                signupUsernameError.textContent = '유효한 아이디를 입력하세요.';
                isValid = false;
            }
            if (!validatePassword(signupPassword.value)) {
                signupPasswordError.textContent = '비밀번호는 6자 이상이어야 합니다.';
                isValid = false;
            }
            if (!validateEmail(signupEmail.value)) {
                signupEmailError.textContent = '유효한 이메일을 입력하세요.';
                isValid = false;
            }
            if (!isValid) e.preventDefault();
        });
    }

    // --- 실시간 영화 순위 ---
    async function loadPopularMovies() {
        try {
            const res = await fetch('/tmdb/popular');
            const data = await res.json();
    
            const container = document.getElementById('realtime-movie-list');
            container.innerHTML = '';
    
            const topMovies = data.results.slice(0, 20);
    
            topMovies.forEach((movie, index) => {
                const p = document.createElement('p');
                p.textContent = `${index + 1}. ${movie.title}`;
                p.style.textAlign = 'center';
                p.style.fontSize = '16px';
                p.style.margin = '5px 0';
                container.appendChild(p);
            });
        } catch (e) {
            console.error('실시간 영화 순위 불러오기 실패:', e);
        }
    }

    loadPopularMovies(); // DOMContentLoaded 안에서 바로 호출
});