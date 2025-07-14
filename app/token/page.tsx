import Token from "@/app/token/Token";
import {tokens} from '../arrays/tokens';
import {month} from '../arrays/month';


export default function TokenPage() {

    return (
        <>
            <Token tokens={tokens} month={month}/>
        </>

    )

}

// export async function getStaticProps() {
//     const response = await fetch(`https://jsonplaceholder.typicode.com/users`)
//     const tokens = await response.json()
//
//     return {
//         props: {tokens}, // will be passed to the page component as props
//     }
// }