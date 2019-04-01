// make database first, model
// create controller,
// create route

const CoffeeSchema = new Schema({ name: , employee: [{ type: Schema.Types.ObjectId, ref: 'Employee' }] });

const AuthSchema = new Schema({
  name: String,
  role: { type: String, enum: ['Customer', 'CoffeeShop'],
  default: 'Customer' },
  coffeShop: { type: Sceham}
}); 

if (user.role === 'CoffeeShop')

componentWillMount() { this.props.fetchCoffeeApi(this.props.user.id); }
