// import type { PageLoad } from './$types';
// import { API_URL } from '$lib/api';

// export const load: PageLoad = async ({ fetch }) => {
//     try {
//         // Page khulte hi pehli baar ka data yahan se jayega
//         const res = await fetch(`${API_URL}/dashboard/data`);
//         const result = await res.json();
//         console.log("Res=>",result)
        
//         return {
//             initialData: result.success ? result.data : null
//         };
//     } catch (err) {
//         return { initialData: null };
//     }
// };