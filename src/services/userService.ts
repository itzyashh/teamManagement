import { doc } from "firebase/firestore";

import { db } from "@/config/firebase";
import { getDoc, getDocs, query as firestoreQuery, collection, where } from "firebase/firestore";

export const getUser = async (uid: string) => {
    const user = await getDoc(doc(db, 'users', uid));
    // add uid to the user data
    return { ...user.data(), id: uid };
}

export const searchUser = async (searchTerm: string) => {
    try {
        // Search in both email and username fields
        const usernameQuery = firestoreQuery(
            collection(db, 'users'), 
            where('username', '>=', searchTerm),
            where('username', '<=', searchTerm + '\uf8ff')
        );
        
        const emailQuery = firestoreQuery(
            collection(db, 'users'), 
            where('email', '>=', searchTerm),
            where('email', '<=', searchTerm + '\uf8ff')
        );
        
        // Run both queries
        const [usernameResults, emailResults] = await Promise.all([
            getDocs(usernameQuery),
            getDocs(emailQuery)
        ]);
        
        // Process username results
        const usernameMatches = usernameResults.docs.map(doc => {
            const data = doc.data();
            const username = data.username || '';
            // Calculate how well the username matches (0-100%)
            const matchScore = calculateMatchScore(username, searchTerm);
            
            return {
                ...data,
                searchMethod: 'username',
                matchScore,
                id: doc.id
            };
        });
        
        // Process email results
        const emailMatches = emailResults.docs.map(doc => {
            const data = doc.data();
            const email = data.email || '';
            // Calculate how well the email matches (0-100%)
            const matchScore = calculateMatchScore(email, searchTerm);
            
            return {
                ...data,
                searchMethod: 'email',
                matchScore,
                id: doc.id
            };
        });
        
        // Combine results, remove duplicates (keeping the one with higher score)
        const combinedResults = [...usernameMatches];
        
        emailMatches.forEach(emailMatch => {
            const existingIndex = combinedResults.findIndex(item => item.id === emailMatch.id);
            
            if (existingIndex === -1) {
                // User not in results yet, add them
                combinedResults.push(emailMatch);
            } else if (emailMatch.matchScore > combinedResults[existingIndex].matchScore) {
                // User already exists with username match, but email match is better
                combinedResults[existingIndex] = emailMatch;
            }
        });
        
        // Sort by match score (highest first)
        return combinedResults.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
        console.error('Error searching users:', error);
        return [];
    }
}

// Helper function to calculate how well a string matches the search term (0-100%)
const calculateMatchScore = (value: string, searchTerm: string) => {
    if (!value) return 0;
    
    const normalizedValue = value.toLowerCase();
    const normalizedSearch = searchTerm.toLowerCase();
    
    // Exact match
    if (normalizedValue === normalizedSearch) return 100;
    
    // Starts with search term
    if (normalizedValue.startsWith(normalizedSearch)) {
        // Score based on how much of the string is matched (longer matches = higher scores)
        return 80 + (normalizedSearch.length / normalizedValue.length) * 20;
    }
    
    // Contains search term
    if (normalizedValue.includes(normalizedSearch)) {
        // Score based on position (earlier = higher) and length of match
        const position = normalizedValue.indexOf(normalizedSearch);
        const positionScore = Math.max(0, 50 - position * 5); // Earlier positions score higher
        const lengthScore = (normalizedSearch.length / normalizedValue.length) * 30;
        return positionScore + lengthScore;
    }
    
    return 0;
}