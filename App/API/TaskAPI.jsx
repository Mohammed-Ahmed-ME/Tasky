import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const API_BASE_URL = 'http://localhost:3000/API/Auth/Tasks';

class TaskAPI {
    constructor() {
        this.axiosInstance = null;
    }

    async getToken() {
        try {
            const token = await AsyncStorage.getItem('token');
            return token;
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    }

    async createAxiosInstance() {
        const token = await this.getToken();

        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                ...(token && {'Authorization': `Bearer ${token}`})
            }
        });

        // Add request interceptor to include token
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                const currentToken = await this.getToken();
                if (currentToken) {
                    config.headers.Authorization = `Bearer ${currentToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor for error handling
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    Alert.alert(
                        'Session Expired',
                        'Please log in again to continue.',
                        [{
                            text: 'OK', onPress: () => {
                                // Navigate to login screen
                                // You can implement navigation logic here
                            }
                        }]
                    );
                }
                return Promise.reject(error);
            }
        );

        return this.axiosInstance;
    }

    async fetchTasks() {
        try {
            if (!this.axiosInstance) {
                await this.createAxiosInstance();
            }

            const response = await this.axiosInstance.get('/Get-Tasks');

            if (response.data && response.data.success) {
                return response.data.tasks || response.data.data || [];
            } else {
                throw new Error(response.data?.message || 'Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);

            let errorMessage = 'Failed to load tasks';
            if (error.response) {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection.';
            } else {
                errorMessage = error.message || 'An unexpected error occurred';
            }

            throw new Error(errorMessage);
        }
    }

    async updateTask(taskId, updatedTask) {
        try {
            if (!this.axiosInstance) {
                await this.createAxiosInstance();
            }

            const response = await this.axiosInstance.put(`/Update-Task/${taskId}`, updatedTask);
            return response.data;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    async createTask(taskData) {
        try {
            if (!this.axiosInstance) {
                await this.createAxiosInstance();
            }

            const response = await this.axiosInstance.post('/Create-Task', taskData);
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    async deleteTask(taskId) {
        try {
            if (!this.axiosInstance) {
                await this.createAxiosInstance();
            }

            const response = await this.axiosInstance.delete(`/Delete-Task/${taskId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
}

export default new TaskAPI();