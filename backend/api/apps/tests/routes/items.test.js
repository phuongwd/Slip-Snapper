const request = require("supertest")
const { makeApp } = require('../../src/index.js');

const getItem = jest.fn();
const addItem = jest.fn();
const deleteItem = jest.fn();
const updateItem = jest.fn();
const retrieveAllSlips = jest.fn();
const updateSlip = jest.fn();
const verifyToken = jest.fn()

const app = makeApp({
  getItem,
  addItem,
  deleteItem,
  updateItem,
  retrieveAllSlips,
  updateSlip
},{},{
    verifyToken
})

/**
 * Test for the get items for user query
 */
describe('Get /item', ()=>{
    const token = ""

    beforeEach(()=>{
        getItem.mockReset();
        verifyToken.mockReset();
    })

    test('should returnall the items from the database for the user', async ()=>{
        const querydata = [
            1,
            2,
            3
        ]

        for (const query of querydata){
            getItem.mockReset();
            getItem.mockResolvedValue({
                message:"All associated items retrieved",
                numItems: 1,
                itemList: [{
                    id: 0,
                    itemId: 1,
                    itemName: "name",
                    type: "type",
                    quantity: 1,
                    price: 111111,
                    location: "location",
                    date: "date"
                  }]
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: query
                }
            });

            const res = await request(app)
                .get('/api/item')
                .set({ "Authorization": "Bearer " + token })

            expect(getItem.mock.calls.length).toBe(1);
            expect(getItem.mock.calls[0][0]).toBe(query);
        }
        
    })

    test('should return a json object containing the itemid', async ()=>{
        let data = [{
            id: 0,
            itemId: 1,
            itemName: "name",
            type: "type",
            quantity: 1,
            price: 111111,
            location: "location",
            date: "date"
          }]

        for (let i = 0; i < 10; i++){
            getItem.mockReset();
            getItem.mockResolvedValue({
                message:"All associated items retrieved",
                numItems: 1,
                itemList: [{
                    id: 0,
                    itemId: 1,
                    itemName: "name",
                    type: "type",
                    quantity: 1,
                    price: 111111,
                    location: "location",
                    date: "date"
                  }]
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: 1
                }
            });

            const res = await request(app)
                .get('/api/item')
                .set({ "Authorization": "Bearer " + token })

            expect(res.body.itemList).toEqual(data);
            expect(res.body.numItems).toEqual(1);
            expect(res.body.message).toEqual("All associated items retrieved");
        }
    })

    test('should return a status code of 200', async ()=>{
        getItem.mockResolvedValue({
            message:"All associated items retrieved",
            numItems: 1,
            itemList: [{
                id: 0,
                itemId: 1,
                itemName: "name",
                type: "type",
                quantity: 1,
                price: 111111,
                location: "location",
                date: "date"
              }]
        });

        verifyToken.mockResolvedValue({
            user: {
                id: 1
            }
        });
        
        const res = await request(app)
            .get('/api/item')
            .set({ "Authorization": "Bearer " + token })

        expect(res.statusCode).toEqual(200);
    })
})

/**
 * Test for the add user query
 */
describe('Post /item', ()=>{
    const token = ""

    beforeEach(()=>{
        addItem.mockReset();
    })

    test('should save the item to the database', async ()=>{
        const bodydata = [
            { userId: 1, location:"location1", date:"date1", total: 0, data: [{ item: "name1", itemQuantities: 1, itemPrices: 1, itemType: "type1", slipId: -1 }]},
            { userId: 2, location:"location2", date:"date2", total: 0, data: [{ item: "name2", itemQuantities: 2, itemPrices: 2, itemType: "type2", slipId: -1 }]},
            { userId: 3, location:"location3", date:"date3", total: 0, data: [{ item: "name3", itemQuantities: 3, itemPrices: 3, itemType: "type3", slipId: -1 }]},
        ]

        for (const body of bodydata){
            addItem.mockReset();
            addItem.mockResolvedValue({
                message:"Item/s has been added",
                numItems: 1,
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: body.userId
                }
            });

            const res = await request(app)
                .post('/api/item')
                .send(
                    body
                )
                .set({ "Authorization": "Bearer " + token })
            
            expect(addItem.mock.calls.length).toBe(1);
            expect(addItem.mock.calls[0][0]).toBe(body.userId);
            expect(addItem.mock.calls[0][1]).toBe(body.location);
            //expect(addItem.mock.calls[0][2]).toBe(body.date);
            expect(addItem.mock.calls[0][3]).toBe(body.total);
            //expect(addItem.mock.calls[0][4]).toBe(body.data);
        }
    })

    test('should return a json object containing the item id ', async ()=>{
        for (let i = 0; i < 10; i++){
            addItem.mockReset();
            addItem.mockResolvedValue({
                message:"Item/s has been added",
                numItems: 1,
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: 1
                }
            });

            const res = await request(app)
                .post('/api/item')
                .send(
                    { userId: 1, location:"location3", date:"date3", data: [{ item: "name3", itemQuantities: 3, itemPrices: 3, itemType: "type3", slipId: -1 }]}
                )
                .set({ "Authorization": "Bearer " + token })

            expect(res.body.numItems).toEqual(1);
            expect(res.body.message).toEqual("Item/s has been added");
        }
    })

    test('should return a status code of 200', async ()=>{
        addItem.mockResolvedValue({
            message:"Item/s has been added",
            numItems: 1,
        });

        verifyToken.mockResolvedValue({
            user: {
                id: 1
            }
        });

        const res = await request(app)
            .post('/api/item')
            .send(
                { userId: 1, location:"location3", date:"date3", data: [{ item: "name3", itemQuantities: 3, itemPrices: 3, itemType: "type3", slipId: -1 }]}
            )
            .set({ "Authorization": "Bearer " + token })

        expect(res.statusCode).toEqual(200);
    })
})

/**
 * Test for the update item query
 */
describe('Patch /item', ()=>{
    const token = ""

    beforeEach(()=>{
        updateItem.mockReset();
        verifyToken.mockReset();
    })

    test('should save the item to the database', async ()=>{
        const bodydata = [
            { itemId: 1, itemname: "name1", itemprice: 1, itemquantity: 1, itemtype: "type1" },
            { itemId: 1, itemname: "name2", itemprice: 2, itemquantity: 2, itemtype: "type2" },
            { itemId: 1, itemname: "name3", itemprice: 3, itemquantity: 3, itemtype: "type3" },
        ]

        //let data = { itemname: "name", itemprice: 1, itemquantity: 1, itemtype: "type" }

        for (const body of bodydata){
            updateItem.mockReset();
            updateItem.mockResolvedValue({
                message:"Item has been updated successfully",
                item: {
                    id: 0,
                    itemName: "name",
                    type: "type",
                    quantity: 1,
                    price: 111111,
                }
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: 1
                }
            });

            const res = await request(app)
                .patch('/api/item')
                .send(
                    body
                )
                .set({ "Authorization": "Bearer " + token })
            
            expect(updateItem.mock.calls.length).toBe(1);
            expect(updateItem.mock.calls[0][0]).toBe(body.itemId);
            //expect(updateItem.mock.calls[0][1]).toBe(body.data);
        }
    })

    test('should return a json object containing the item id ', async ()=>{
        let data = {
                id: 0,
                itemName: "name",
                type: "type",
                quantity: 1,
                price: 111111,
            }
        for (let i = 0; i < 10; i++){
            updateItem.mockReset();
            updateItem.mockResolvedValue({
                message:"Item has been updated successfully",
                item: {
                    id: 0,
                    itemName: "name",
                    type: "type",
                    quantity: 1,
                    price: 111111,
                }
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: 1
                }
            });

            const res = await request(app)
                .patch('/api/item')
                .send(
                    { itemId: 1, data: { itemname: "name3", itemprice: 3, itemquantity: 3, itemtype: "type3" }}
                )
                .set({ "Authorization": "Bearer " + token })

            expect(res.body.item).toEqual(data);
            expect(res.body.message).toEqual("Item has been updated successfully")
        }
    })

    test('should return a status code of 200', async ()=>{
        updateItem.mockResolvedValue({
            message:"Item has been updated successfully",
            item: {
                id: 0,
                itemName: "name",
                type: "type",
                quantity: 1,
                price: 111111,
            }
        });

        verifyToken.mockResolvedValue({
            user: {
                id: 1
            }
        });
        
        const res = await request(app)
            .patch('/api/item')
            .send(
                { itemId: 1, data: { itemname: "name3", itemprice: 3, itemquantity: 3, itemtype: "type3" }}
            )
            .set({ "Authorization": "Bearer " + token })

        expect(res.statusCode).toEqual(200);
        
    })
})

/**
 * Test for the delete item query
 */
describe('Delete /item', ()=>{
    const token = ""

    beforeEach(()=>{
        deleteItem.mockReset();
        verifyToken.mockReset();
    })

    test('should delete the item from the database', async ()=>{
        const bodydata = [
            { itemId: 1 },
            { itemId: 2 },
            { itemId: 3 },
        ]

        for (const body of bodydata){
            deleteItem.mockReset();
            deleteItem.mockResolvedValue({
                message:"Item has been deleted",
                item: {
                    id: 0,
                    itemName: "name",
                    type: "type",
                    quantity: 1,
                    price: 111111,
                }
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: 1
                }
            });

            const res = await request(app)
                .delete('/api/item')
                .send(
                    body
                )
                .set({ "Authorization": "Bearer " + token })
            
            expect(deleteItem.mock.calls.length).toBe(1);
            expect(deleteItem.mock.calls[0][0]).toBe(body.itemId);
        }
    })

    test('should return a json object containing the item id ', async ()=>{
        let data = {
            id: 0,
            itemName: "name",
            type: "type",
            quantity: 1,
            price: 111111,
        }
        
        for (let i = 0; i < 10; i++){
            deleteItem.mockReset();
            deleteItem.mockResolvedValue({
                message:"Item has been deleted",
                item: {
                    id: 0,
                    itemName: "name",
                    type: "type",
                    quantity: 1,
                    price: 111111,
                }
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: 1
                }
            });

            const res = await request(app)
                .delete('/api/item')
                .send(
                    { itemId: 1 }
                )
                .set({ "Authorization": "Bearer " + token })

            expect(res.body.item).toEqual(data);
            expect(res.body.message).toEqual("Item has been deleted");
        }
    })

    test('should return a status code of 200', async ()=>{
        deleteItem.mockResolvedValue({
            message:"Item has been deleted",
            item: {
                id: 0,
                itemName: "name",
                type: "type",
                quantity: 1,
                price: 111111,
            }
        });
        
        verifyToken.mockResolvedValue({
            user: {
                id: 1
            }
        });

        const res = await request(app)
            .delete('/api/item')
            .send(
                { itemId: 1 }
            )
            .set({ "Authorization": "Bearer " + token })

        expect(res.statusCode).toEqual(200);
        
    })
})

/**
 * Test for the get slip for user query
 */
describe('Get /item/slip', ()=>{
    const token = ""

    beforeEach(()=>{
        retrieveAllSlips.mockReset();
        verifyToken.mockReset();
    })

    test('should returnall the items from the database for the user', async ()=>{
        const querydata = [
            1,
            2,
            3
        ]

        for (const query of querydata){
            retrieveAllSlips.mockReset();
            retrieveAllSlips.mockResolvedValue({
                message:"All slips retrieved",
                slips: [{}],
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: query
                }
            });

            const res = await request(app)
                .get('/api/item/slip')
                .set({ "Authorization": "Bearer " + token })

            expect(retrieveAllSlips.mock.calls.length).toBe(1);
            expect(retrieveAllSlips.mock.calls[0][0]).toBe(query);
        }
        
    })

    test('should return a json object containing the itemid', async ()=>{
        let data = [{}]

        for (let i = 0; i < 10; i++){
            retrieveAllSlips.mockReset();
            retrieveAllSlips.mockResolvedValue({
                message:"All slips retrieved",
                slips: [{}],
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: 1
                }
            });

            const res = await request(app)
                .get('/api/item/slip')
                .set({ "Authorization": "Bearer " + token })

            expect(res.body.slips).toEqual(data);
            expect(res.body.message).toEqual("All slips retrieved");
        }
    })

    test('should return a status code of 200', async ()=>{
        retrieveAllSlips.mockResolvedValue({
            message:"All slips retrieved",
            slips: [{}],
        });

        verifyToken.mockResolvedValue({
            user: {
                id: 1
            }
        });
        
        const res = await request(app)
            .get('/api/item/slip')
            .set({ "Authorization": "Bearer " + token })

        expect(res.statusCode).toEqual(200);
    })
})

/**
 * Test for the get slip for user query
 */
describe('Post /item/slip', ()=>{
    const token = ""

    beforeEach(()=>{
        updateSlip.mockReset();
        verifyToken.mockReset();
    })

    test('should update all the items in the database', async ()=>{
        const bodyData = [
            {userId:1, updateSlip:{text:[]}, insertItems:{}, updateItems:{}, removeItems:{}},
            {userId:2, updateSlip:{text:[]}, insertItems:{}, updateItems:{}, removeItems:{}},
            {userId:3, updateSlip:{text:[]}, insertItems:{}, updateItems:{}, removeItems:{}}
        ]

        for (const body of bodyData){
            updateSlip.mockReset();
            updateSlip.mockResolvedValue({
                message:"Slip updated",
                slip: {},
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: body.userId
                }
            });

            const res = await request(app)
                .patch('/api/item/slip')
                .send(
                    body
                )
                .set({ "Authorization": "Bearer " + token })

            expect(updateSlip.mock.calls.length).toBe(1);
            //expect(updateSlip.mock.calls[0][0]).toBe(body);

        }
        
    })

    test('should return a json object containing the itemid', async ()=>{
        let data = {}

        for (let i = 0; i < 10; i++){
            updateSlip.mockReset();
            updateSlip.mockResolvedValue({
                message:"Slip updated",
                slip: {},
            });

            verifyToken.mockReset();
            verifyToken.mockResolvedValue({
                user: {
                    id: 1
                }
            });

            const res = await request(app)
                .patch('/api/item/slip')
                .send(
                    {userId:1, updateSlip:{text:[]}, insertItems:{}, updateItems:{}, removeItems:{}}
                )
                .set({ "Authorization": "Bearer " + token })

            //expect(res.body.slip).toEqual(data);
            expect(res.body.message).toEqual("Slip updated");
        }
    })

    test('should return a status code of 200', async ()=>{
        updateSlip.mockResolvedValue({
            message:"Slip updated",
            slip: {},
        });
        
        verifyToken.mockResolvedValue({
            user: {
                id: 1
            }
        });

        const res = await request(app)
            .patch('/api/item/slip')
            .send(
                {userId:1, updateSlip:{text:[]}, insertItems:{}, updateItems:{}, removeItems:{}}
            )
            .set({ "Authorization": "Bearer " + token })

        expect(res.statusCode).toEqual(200);
    })
})
