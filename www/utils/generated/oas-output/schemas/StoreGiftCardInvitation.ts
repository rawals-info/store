/**
 * @schema StoreGiftCardInvitation
 * type: object
 * description: The gift card invitation's details.
 * x-schemaName: StoreGiftCardInvitation
 * required:
 *   - id
 *   - email
 *   - status
 *   - gift_card
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The gift card invitation's ID.
 *   email:
 *     type: string
 *     title: email
 *     description: The gift card invitation's email.
 *     format: email
 *   status:
 *     type: string
 *     title: status
 *     description: The gift card invitation's status.
 *   gift_card:
 *     $ref: "#/components/schemas/StoreGiftCard"
 * 
*/

