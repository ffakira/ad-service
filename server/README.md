## API Endpoints

### Aidrop `/api/airdrop`

Admins:

- Allows to create a new NFT address via MongoDB, and generatres redeem codes
- Requires to manually edit the address, by default is set to `0x0`
- Allows the delete NFTs along with redeemed codes associated with

Users:

- Allows to claim NFT address by putting their wallet address and redeem code

### User Authentication `/api/auth`

User auth enables a basic session based authentication:

- `isAdmin` identifies the role
- `isAuth` identifies if the user is logged in
- `username` for display purpose

<table>
   <thead>
      <tr>
         <th>Method</th>
         <th>Endpoint</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>GET</td>
         <td>/all</td>
         <td>Will get the total row count of users</td>
      </tr>
      <tr>
         <td>GET</td>
         <td>/session</td>
         <td>Gets the current session of the user</td>
      </tr>
      <tr>
         <td>POST</td>
         <td>/login</td>
         <td>Initializes a new session and authenticate users</td>
      </tr>
      <tr>
         <td>POST</td>
         <td>/register</td>
         <td>Creates a new user using <code>bcrypt</code> as password hashing mechanism</td>
      </tr>
      <tr>
         <td>DELETE</td>
         <td>/logout</td>
         <td>Destroy the session to logout the user</td>
      </tr>
   </tbody>
</table>

### Airdrop `/api/airdrop`

- Allow admins to generate airdrop via `Mongo` by setting a quantity
- Allow users to claim the NFT via by wallet address and redeem code

<table>
   <thead>
      <tr>
         <th>Method</th>
         <th>Endpoint</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>POST</td>
         <td>/redeem/new</td>
         <td>Generates new redeem codes associated with the NFT</td>
      </tr>
      <tr>
         <td>PUT</td>
         <td>/redeem/:airdropId</td>
         <td>Updates the recipient address, perhaps update the api endpoint to be more meaningful</td>
      </tr>
      <tr>
         <td>POST</td>
         <td>/redeem/nft/:address</td>
         <td>Redeem NFT by providing recipient address, code and nft address 
      </tr>
      <tr>
         <td>GET</td>
         <td>/redeem/nft/:address</td>
         <td>Get a list of redeem codes, wallet address associated with NFT address</td>
      </tr>
   </tbody>
</table>

### NFT `/api/nft`

<table>
   <thead>
      <tr>
         <th>Method</th>
         <th>Endpoint</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>GET</td>
         <td>/all</td>
         <td>Get all NFT address</td>
      </tr>
      <tr>
         <td>DELETE</td>
         <td>/:address</td>
         <td>Deletes NFT address and airdrop associated with</td>
      </tr>
   </tbody>
</table>
