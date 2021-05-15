import { type } from 'jquery';
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Link } from 'react-router-dom';
import './FarmForm.css'

export class FarmForm extends Component {
  state = {
    step: 1,
    farmName: 'Farm Name',
    farmDescription: 'Farm Description',
    address: '123 Exapmle Street',
    email: 'email@domain.com',
    occupation: '',
    city: 'AnyCity',
    state: 'OH',
    zip: '12456',
    bio: '',
    phone: '513-777-7777',
    organic: true,
    customProduct: "",
    produceInfo: [],
    farmID: ""
  };

  // Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  // Go back to prev step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  // Handle fields change
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleCheck = () => {
    const { organic } = this.state;
    this.setState({
      organic: !organic
    });
  }

  updateProducts = (id, products) => {
    const elementsIndex = products.findIndex(element => element._id === id)
    let newArray = [...products];
    newArray[elementsIndex] = { ...newArray[elementsIndex], select: !newArray[elementsIndex].select }
    this.setState({
      produceInfo: newArray
    });
  }

  handleCustomProductAdd = input => {
    const newProduct = input;
    let duplicate = false;
    this.state.produceInfo.map(function (product, index) {
      if (product.name === newProduct) {
        duplicate = true;
      }
    }
    )
    if (duplicate != true) {
      const lastID = this.state.produceInfo.length + 1;
      const obj = { _id: lastID, name: newProduct, description: "", select: true, custom: true }
      this.setState({
        produceInfo: [...this.state.produceInfo, obj]
      });
      console.log(this.state.produceInfo)
    }
    else {
      alert("That product already exists");
    }
  }

  addFarm = async () => {
    var farmAddress = this.state.address + ", " + this.state.state + ", " + this.state.zip;
    var finalProduce = [];
    var customProduce = [];
    var allProduce = [];
    for (var i = 0; i < this.state.produceInfo.length; i++) {
      if (this.state.produceInfo[i].custom === true) {
        customProduce.push(this.state.produceInfo[i]);
        /*var id = this.state.produceInfo[i]._id
        var produceId = id.substring(1, id.length - 1)
        console.log(id)
        allProduce.push(id)*/
      }
      else if (this.state.produceInfo[i].select === true) {
        finalProduce.push(this.state.produceInfo[i]);
        //var id = this.state.produceInfo[i]._id
        //console.log(typeof id)
        //var produceId = id.substring(1, id.length - 1)
        //console.log(id)
        //allProduce.push(id)
      }
    }
    const response = await fetch('/api/farm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: this.state.farmName, description: this.state.farmDescription, address: farmAddress, is_organic: this.state.organic }),
    })

    const body = await response.text();
    var farmId = body;
    console.log(farmId)

    this.set(farmId)
    for (var i = 0; i < customProduce.length; i++) {
      const response = await fetch('/api/produce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ farm_id: this.state.farmID, name: customProduce[i].name, description: " " }),
      })
      const body = await response.text();
      var id = body.substring(1, body.length-1)
      console.log(id);
      allProduce.push(id)
    }

    for (var i = 0; i < finalProduce.length; i++) {
      const response = await fetch('/api/produce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ farm_id: this.state.farmID, name: finalProduce[i].name, description: " " }),
      })
      const body = await response.text();
      var id = body.substring(1, body.length-1)
      console.log(id);
      allProduce.push(id)
    }
    console.log(allProduce)
    const response2 = await fetch('/api/farmAddProduce', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ farm_id: this.state.farmID, produce: allProduce }),
    })
    const body2 = await response2.text();
      console.log(body2);
    this.nextStep();
  }

  addProduce = async () => {
    var finalProduce = [];
    var customProduce = [];
    console.log("Made it in addProduce")
    console.log("ProduceInfo: " + this.state.produceInfo)
    for (var i = 0; i < this.state.produceInfo.length; i++) {
      if (this.state.produceInfo[i].custom === true) {
        customProduce.push(this.state.produceInfo[i]);
      }
      else if (this.state.produceInfo[i].select === true) {
        finalProduce.push(this.state.produceInfo[i]._id);
      }
    }
    console.log("Final Produce: " + finalProduce);
    console.log("Custom Produce: " + customProduce);
    var arr = finalProduce + customProduce
    console.log("Custom and Final: " + arr);

    for (var i = 0; i < arr.length; i++) {
      const response = await fetch('/api/produce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ farm_id: this.state.farmID, name: arr.name, description: " " }),
      })

      const body = await response.text();
      console.log(body);
    }

  }

  set(farmId) {
    farmId = farmId.substring(1, farmId.length - 1)
    this.setState({ farmID: farmId })
    //this.nextStep();
    /*return <SubmitFarmForm
    farmID={farmId}
  />;*/
  }
  componentDidMount() {
    var that = this;
    var produceArr = [];
    fetch('/api/masterProduce', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.ok) return response.json();
      throw new Error(response.statusText)  // throw an error if there's something wrong with the response
    })
      .then(function handleData(data) {
        produceArr = data;
        that.setProduce(produceArr);
      })
      .catch(function handleError(error) {
        console.log(error);
      })

  }

  setProduce(produce) {
    for (var i = 0; i < produce.length; i++) {
      produce[i].select = false;
      produce[i].custom = false;
    }
    this.setState({ produceInfo: produce })
    console.log(this.state.produceInfo);
  }

  render() {
    const { step } = this.state;
    const { farmID, farmName, farmDescription, email, occupation, city, bio, state, zip, address, phone, organic, customProduct } = this.state;
    const values = { farmID, farmName, farmDescription, email, occupation, city, bio, state, zip, address, phone, organic, customProduct };

    switch (step) {
      case 1:
        return (
          <FormFarmDetails
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            handleCheck={this.handleCheck}
            values={values}
          />
        );
      case 2:
        return (
          <FormAddressDetails
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            values={values}
          />
        );
      case 3:
        return (
          <FormContactDetails
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}

            values={values}
          />
        );

      case 4:
        return (
          <FormProduct
            values={values}
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            updateProducts={this.updateProducts}
            produceInfo={this.state.produceInfo}
            handleCustomProductAdd={this.handleCustomProductAdd}
          />
        );

      case 5:
        return (
          <Confirm
            nextStep={this.nextStep}
            addFarm={this.addFarm}
            prevStep={this.prevStep}
            values={values}
            products={this.state.produceInfo}
          />
        );
      case 6:
        return (
          <SubmitFarmForm
            farmID={this.state.farmID}
            addProduce={this.addProduce}
          />
        );
      default:
    }
  }
}

class FormFarmDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };


  render() {
    const { values, handleChange, handleCheck } = this.props;
    return (
      <form class="box" >
        <h1>Farm Details</h1>

        <div class="block">
          <label for="name">Farm Name</label>
          <input type="text" name="" id="name" defaultValue={values.farmName} onChange={handleChange('farmName')} />
        </div>

        <div class="block">
          <label for="description">Farm Description</label>
          <textarea name="description" id="description" defaultValue={values.farmDescription} onChange={handleChange('farmDescription')}></textarea>
        </div>

        <div class="block">
          <label for="description">Organic Farm?</label>
          <input type="checkbox" name="description" id="description" defaultChecked={values.organic} onChange={handleCheck} />
        </div>

        <br></br>
        <input type="submit" name="" id="continue" value="Contiue" onClick={this.continue} />
      </form>
    );
  }
}

class FormAddressDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { values, handleChange } = this.props;
    return (
      <form class="box">
        <h1>Farm Location</h1>

        <div class="block">
          <label for="address">Address</label>
          <input type="text" id="address" defaultValue={values.address} onChange={handleChange('address')} />
        </div>

        <div class="block">
          <label for="city">City</label>
          <input type="text" id="city" defaultValue={values.city} onChange={handleChange('city')} />
        </div>

        <div class="block">
          <label for="state">State</label>
          <input type="text" id="state" defaultValue={values.state} onChange={handleChange('state')} />
        </div>

        <div class="block">
          <label for="zip">Zip</label>
          <input type="text" id="zip" defaultValue={values.zip} onChange={handleChange('zip')} />
        </div>

        <input type="submit" name="" id="back" value="Back" onClick={this.back} />
        <input type="submit" name="" id="continue" value="Contiue" onClick={this.continue} />

      </form>
    );
  }
}

class FormContactDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const { values, handleChange } = this.props;
    return (
      <div class="box">
        <h1>Contact Information</h1>

        <div class="block">
          <label for="phone">Phone Number</label>
          <input type="text" id="phone" defaultValue={values.phone} onChange={handleChange('phone')} />
        </div>

        <div class="block">
          <label for="email">Email</label>
          <input type="text" id="email" defaultValue={values.email} onChange={handleChange('email')} />
        </div>

        <input type="submit" name="" id="back" value="Back" onClick={this.back} />
        <input type="submit" name="" id="continue" value="Contiue" onClick={this.continue} />

      </div>
    );
  }
}

class FormProduct extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    console.log('in here');
    this.props.prevStep();
  };

  render() {
    const { handleCustomProductAdd, values, handleChange } = this.props;
    return (
      <div class="boxProduct">
        <h1>Add Farm Products</h1>

        <div>
          <div class="customProduct">
            <label for="name">Add Custom Product</label>
            <input type="text" name="" id="name" defaultValue={values.customProduct} onChange={handleChange('customProduct')} />
            <input type="submit" name="" id="custom" value="Add Custom Product" onClick={() => { handleCustomProductAdd(values.customProduct) }} />
          </div>
          <PendingItems products={this.props.produceInfo} updateProducts={this.props.updateProducts}></PendingItems>

          <AddedItems products={this.props.produceInfo} updateProducts={this.props.updateProducts} farmName={this.props.values.farmName} />
        </div>

        <input type="submit" name="" id="back" value="Back" onClick={this.back} />
        <input type="submit" name="" id="continue" value="Contiue" onClick={this.continue} />


      </div>

    );
  }
}

class AddedItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log(this.props.products);
  }

  render() {
    const { updateProducts, products } = this.props;
    return (
      <div className="addedItems">
        <h1>Produce for {this.props.farmName}</h1>
        {
          this.props.products.map(function (product, index) {
            if (product.select === true)
              return <><p className="item" key={product._id}>{product.name} <button className="mark_pending" key={product._id} onClick={() => updateProducts(product._id, products)}>Remove From Farm</button></p></>
          })
        }

      </div>
    )
  }
}

class PendingItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { updateProducts, products } = this.props;
    return (
      <div className="pendingItems">
        <h1>Available Products</h1>
        {
          this.props.products.map(function (product, index) {
            if (product.select === false)
              return <><p className="item" key={product._id}>{product.name} <button className="mark_complete" key={product._id} onClick={() => updateProducts(product._id, products)}>Add to Farm</button></p></>
          })
        }
      </div>
    )
  }
}

//Allows farmer to have an overview of farm details
//They can make modifications or submit their farm
class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  continue = e => {
    e.preventDefault();
    // PROCESS FORM //
    this.props.addFarm();

  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const {
      values: { farmName, farmDescription, address, state, zip, email, phone, city, organic }
    } = this.props;
    return (
      <form class="box">
        <div>
          <h1>Farm Details</h1>
                Farm Name : {farmName} <br></br>
                Farm Description : {farmDescription} <br></br>
                Organic Farm : {`${organic}`} <br></br>
        </div>

        <div class="confirmDiv">
          <h1>Farm Address</h1>
                Address : {address} <br></br>
                City : {city} <br></br>
                State : {state} <br></br>
                Zip : {zip} <br></br>
        </div>

        <div class="confirmDiv">
          <h1>Contact Information</h1>
                Phone : {phone} <br></br>
                Email : {email} <br></br>
        </div>

        <div class="confirmDiv">
          <h1>Products Available</h1>
          <FinalProductList selectedProducts={this.props.products}></FinalProductList>
        </div>

        <div>
          <input type="submit" name="" id="back" value="Back" onClick={this.back} />
          <input type="submit" name="" id="continue" value="Confirm" onClick={this.continue} />
        </div>


      </form>
    );
  }
}

//returns a list of all selected products
class FinalProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        {
          this.props.selectedProducts.map(function (product, index) {
            if (product.select === true)
              return <>{product.name}<br></br></>
          })
        }
      </div>
    )
  }
}

//sends farmer to their farm profile
class SubmitFarmForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var id = this.props.farmID
    console.log(id)
    const path = "/farmerProfile?farmId=" + id
    return (
      <div>
        <h1>Thank You For Your Submission</h1>
        <p>You will get an email with further instructions.</p>
        <div><Link to={path} >Continue to profile</Link></div>
      </div>
    );
  }
}

export default FarmForm;
