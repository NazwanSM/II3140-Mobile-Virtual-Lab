// Supabase client
export { supabase } from './supabase/client';

// Auth actions
export {
    getProfile,
    getSession, getUser, signInWithEmail, signInWithGoogle, signInWithUsername, signOut, signUpWithEmail
} from './actions/auth';

// Profile actions
export {
    getLeaderboard,
    getTintaBalance,
    getUserArtworks, selectArtwork, updatePassword, updateProfile
} from './actions/profile';

// Progress actions
export {
    getAllProgress, getDashboardStats, getModuleProgress, getRecentProgress, updateModuleProgress
} from './actions/progress';

// Quiz actions
export {
    getAllQuizResults, getQuizQuestions,
    getQuizResults, submitQuiz
} from './actions/quiz';

// Module actions
export {
    getModuleById,
    getModuleBySlug, getModuleContent, getModules, getModulesWithProgress
} from './actions/modules';

