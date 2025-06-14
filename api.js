const BASE_URL = "http://localhost:5000/api"; // Change this if deployed

// ✅ Register New User
async function registerUser(userData) {
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        return await res.json();
    } catch (err) {
        console.error("❌ Registration Error:", err);
        return { msg: "❌ Registration failed!" };
    }
}

// ✅ Login User
async function loginUser(credentials) {
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (res.ok && data.token) {
            localStorage.setItem("token", data.token); // Save token
        }
        return data;
    } catch (err) {
        console.error("❌ Login Error:", err);
        return { msg: "❌ Login failed!" };
    }
}

// ✅ Get Workout Plan by goal & level
async function fetchWorkoutPlan(goal, level) {
    try {
        const res = await fetch(`${BASE_URL}/workout?goal=${goal}&level=${level}`);
        return await res.json();
    } catch (err) {
        console.error("❌ Workout Fetch Error:", err);
        return { msg: "❌ Failed to fetch workout!" };
    }
}

// ✅ Get Diet Plan by goal
async function fetchDietPlan(goal) {
    try {
        const res = await fetch(`${BASE_URL}/diet?goal=${goal}`);
        return await res.json();
    } catch (err) {
        console.error("❌ Diet Fetch Error:", err);
        return { msg: "❌ Failed to fetch diet!" };
    }
}
