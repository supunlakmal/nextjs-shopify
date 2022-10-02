import Head from 'next/head'
import Image from 'next/image'
import { Key, useEffect, useState } from 'react'
import { checkout } from '../checkout'
import styles from '../styles/Home.module.css'

export default function Home() {


  const [productsList ,setProductsList]  = useState<any[]|null>(null)


useEffect(()=>{


  const productQuery = () => `{
    products(first: 3) {
      edges {
        node {
          id
          title
          description
          images (first: 1) {
            edges {
              node {
                id
                url
              }
            }
          }
        }
      }
    }
  }
  `;

const STOREFRONT_ACCESS_TOKEN =  'fec6385ecb9fca8dc78e65d5e419aade'

const GRAPHQL_URL = 'https://mystore-4193.myshopify.com/api/2020-07/graphql.json'


const GRAPHQL_BODY  = () => {
	return {
	'async': true,
	'crossDomain': true,
	'method': 'POST',
	'headers': {
		'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
		'Content-Type': 'application/graphql',
	},
	'body': productQuery()
	};
}


fetch(GRAPHQL_URL, GRAPHQL_BODY())
        .then(res => res.json())
	.then(products => {

    setProductsList(products?.data?.products.edges)
	})

},[])







  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to My App Store
        </h1>

{productsList?.length && productsList.map((product,a)=>{

  const {node} = product||{};
  const {title ,description ,images} = node||{};
  const {edges} = images||{};



return (
<div key={a}>
<div>



{edges?.length && edges?.map((image: { node: { url: string | undefined } },i: Key | null | undefined)=>{


return (<div key={i}> <img src={image.node.url}/></div>)
})}



<div> Product Name : {title} </div>
<div> Product description : {description} </div>
<button onClick={(() => {
              checkout({
                lineItems: [
                  {
                    price: "price_1LoP3HLEfSyaqL7bpXyLv4UG",
                    quantity: 1
                  }
                ]
              })
            })}>BUY!</button>
  
</div>
</div>

)
})}



      </main>

   
    </div>
  )
}