import mongoose from 'mongoose';

const {Schema} = mongoose;

const OfferSchema = new Schema({    
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    dateStart: {
        type: Date,
        required: true
    },
   
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner'  
    },
    views: {
        type: Number,
        default: 0
    },
    reservation: {
        type: Number,  
        default: 100
    },
    categories: {
        type: String,
        enum: ['Books', 'Museums', 'Library', 'Cinema'],
        required: true
    }
}, { timestamps: true });

const Offers = mongoose.model('Offers', OfferSchema);
export default Offers;