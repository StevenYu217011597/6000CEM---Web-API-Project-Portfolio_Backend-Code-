const expect = require('chai').expect
const request = require('request')
const { testURL } = require('../test_constants')

describe('Create User API', () => {
    describe('CREATE USER', () => {
      describe('Create user validation ERROR', () => {
        describe('Create user missing field', () => {
          const payload = {
            name: "",
            email: "Chan@gmail.com",
            password: "P@ssw0rd",
            role: ""
          }

          jest.setTimeout(300)

          it('Status', done => {
            request.post(`${testURL}/user/register`, {
              json: payload
            }, (_, response) => {
              expect(response.statusCode).to.equal(500)
              done()
            })
          })
        })
  
        describe('Create user invalid email field', () => {
          const payload = {
            name: "Chan",
            email: "Chan",
            password: "P@ssw0rd",
            role: ""
          }
    
          it('Status', done => {
            request.post(`${testURL}/user/register`, {
              json: payload
            }, (_, response) => {
              expect(response.statusCode).to.equal(400)
              done()
            })
          })
        })
  
        describe('Create user duplicate', () => {
          const payload = {
            name: "admin",
            email: "admin@mail.com",
            password: "123456",
            role: "ABC"
          }
    
          it('Status', done => {
            request.post(`${testURL}/user/register`, {
              json: payload
            }, (_, response) => {
              expect(response.statusCode).to.equal(400)
              done()
            })
          })
        })
      })
  
      it('Create user SUCCESS', done => {
        request.post(`${testURL}/user/register`, {
          json: {
            name: "Chan2",
            email: "Chan2@mail.com",
            password: "123456",
            role: ""
          }
        }, (_, response) => {
          expect(response.statusCode).to.equal(200)
          done()
        })
      })
      
      it('Create employee SUCCESS', done => {
        request.post(`${testURL}/user/register`, {
          json: {
            name: "employee02",
            email: "employee02@mail.com",
            password: "123456",
            role: "ABC"
          }
        }, (_, response) => {
          expect(response.statusCode).to.equal(200)
          done()
        })
      })
    })
  })


  describe('Create Dogs API', () => {
    describe('Create Dogs', () => {
      it('Create dog SUCCESS', done => {
        request.post(`${testURL}/api/dogs/${dog._id}`, {
          json: {
            dog_id: '005',
            dog_name: 'Tom',
            dog_desc: 'Funny',
            dog_dob: '19/05/2022',
            dog_status: 'Available',
            _id:'123'
          }
        }, (_, response) => {
          expect(response.statusCode).to.equal(200)
          done()
        })
      })

      it('Create dog missing id', done => {
        request.post(`${testURL}/api/dogs/${dog._id}`, {
          json: {
            dog_id: '',
            dog_name: 'Tom',
            dog_desc: 'Funny',
            dog_dob: '19/05/2022',
            dog_status: 'Available',
            _id:'123'
          }
        }, (_, response) => {
          expect(response.statusCode).to.equal(400)
          done()
        })
      })

      it('Create dog missing name', done => {
        request.post(`${testURL}/api/dogs/${dog._id}`, {
          json: {
            dog_id: '005',
            dog_name: '',
            dog_desc: 'Funny',
            dog_dob: '19/05/2022',
            dog_status: 'Available',
            _id:'123'
          }
        }, (_, response) => {
          expect(response.statusCode).to.equal(400)
          done()
        })
      })

      it('Create dog missing birthday field', done => {
        request.post(`${testURL}/api/dogs/${dog._id}`, {
          json: {
            dog_id: '005',
            dog_name: 'Tom',
            dog_desc: 'Funny',
            dog_dob: '',
            dog_status: 'Available',
            _id:'123'
          }
        }, (_, response) => {
          expect(response.statusCode).to.equal(400)
          done()
        })
      })

      it('Create dog missing status field', done => {
        request.post(`${testURL}/api/dogs/${dog._id}`, {
          json: {
            dog_id: '005',
            dog_name: 'Tom',
            dog_desc: 'Funny',
            dog_dob: '19/05/2022',
            dog_status: '',
            _id:'123'
          }
        }, (_, response) => {
          expect(response.statusCode).to.equal(400)
          done()
        })
      })
    })

    describe('Delete Dogs', () => {
      it('Delete specific dog', done => {
        request.delete(`${testURL}/api/dogs/${id}`, {
          json:{
            id: '62bb24620cae8204a6030a5a'
          }
        }, (_, response) => {
          expect(response.statusCode).to.equal(200)
          done()
        })
      })

      it('Fail delete dog', done => {
        request.delete(`${testURL}/api/dogs/${id}`, {
          json:{
            id: ''
          }
        }, (_, response) => {
          expect(response.statusCode).to.equal(400)
          done()
        })
      })

    })

    describe('Get Dogs', () => {
      it('Get dog success', done => {
        request.get(`${testURL}/api/dogs/62bb24620cae8204a6030a5a`, 
        (_, response) => {
          expect(response.statusCode).to.equal(200)
          done()
        })
      })
    })
  })


  