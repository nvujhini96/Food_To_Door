import React from "react";
import { Link } from "react-router-dom";
import "../styles/OrderStyle.css";

import Menu from "../components/Menu";
import data from "../data/data.json";
import MyCart from "../components/MyCart";
import CreditCard from "../components/CreditCard";
class Orders extends React.Component {
  constructor() {
    super();
    this.state = {
      list: data,
      id: "",
      newList: [],
      price: "",
      name: [],
      total: 0,
      quantity: 0,
      clickable: false,
      lat: "",
    };
  }

  componentWillMount() {
    const hotel = this.props.history.location.pathname.slice(7);
    const List = this.state.list.filter(function(rec) {
      return rec.name === hotel;
    });
    this.setState({
      id: hotel,
      newList: List,
    });
  }

  childHandler = (ChildPrice, ChildName, ChildQuantity) => {
    const names = this.state.name;
    names.push(ChildName);
    this.setState({
      price: ChildPrice,
      name: names,
      quantity: ChildQuantity + 1,
      clickable: true,
    });
  };

  incrementQuantity = (incQuan) => {
    this.setState({
      quantity: incQuan + 1,
    });
  };

  decrementQuantity = (decQuan) => {
    if (this.state.quantity >= 1) {
      this.setState({
        quantity: decQuan - 1,
      });
    }
  };

  total = (p, q) => {
    this.setState({
      total: p * q,
    });
  };

  render() {
    console.log();
    return (
      <div>
        <div className="nav">
          <div id="logo">
            <h2>Food To Door</h2>
          </div>

          <div id="user">
            <div className="name">Hello, User</div>
            <div className="profile">
              <img src={""} id="img" height="45" width="45" alt="profile" />
            </div>
          </div>
        </div>

        <div id="content">
          <div id="head">
            <h1 className="hname">{this.state.newList.map((x) => x.name)}</h1>
            <h5 className="aname">
              <i class="fa fa-map-marker" style={{ fontSize: 18 }}></i>{" "}
              {this.state.newList.map((x) => x.address)}
            </h5>
            <div id="items">
              <center>
                <h2>Order Now</h2>
              </center>
              <br />

              {this.state.newList.map((x) =>
                x.menu.map((item) => (
                  <Menu
                    id={item.id}
                    desc={item.desc}
                    price={item.price}
                    name={item.name}
                    action={this.childHandler}
                  />
                ))
              )}
            </div>
          </div>
          <div id="panel">
            <div id="logo"></div>
            <div id="right">
              <div id="right-in">
                <h4>My Cart</h4>

                {this.state.clickable && (
                  <div>
                    <MyCart
                      name={this.state.name}
                      price={this.state.price}
                      quantity={this.state.quantity}
                      increment={this.incrementQuantity}
                      decrement={this.decrementQuantity}
                    ></MyCart>
                  </div>
                )}

                <div id="total">
                  <p id="total">
                    {" "}
                    Total amount:
                    <span className="spn">
                      {"\u20B9"} {this.state.total}
                    </span>
                  </p>
                  <input
                    id="pay"
                    type="button"
                    value="Calculate"
                    onClick={() =>
                      this.total(this.state.price, this.state.quantity)
                    }
                  />

                  <div>
                    {" "}
                    <CreditCard />
                  </div>

                  <br />
                  <Link
                    to={{
                      pathname: "/transport",
                      state: { List: this.state.newList },
                    }}
                  >
                    <input id="pay" type="button" value="Pay Now" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Orders;
