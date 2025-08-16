import React from 'react';
import { Star, ThumbsUp, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Review {
  _id: string;
  userId: {
    name: string;
  };
  rating: number;
  title: string;
  comment: string;
  images: string[];
  verified: boolean;
  helpful: string[];
  createdAt: string;
  response?: {
    text: string;
    respondedAt: string;
    respondedBy: {
      name: string;
    };
  };
}

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  onHelpfulClick: (reviewId: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  currentUserId,
  onHelpfulClick
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-500">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white border rounded-lg p-6 shadow-sm">
          {/* Review Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                {review.userId.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {review.userId.name}
                  </span>
                  {review.verified && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle size={14} className="mr-1" />
                      Verified Purchase
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={`/uploads/${image}`}
                    alt={`Review image ${index + 1}`}
                    className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => {
                      // Open image in modal/lightbox
                      window.open(`/uploads/${image}`, '_blank');
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Store Response */}
          {review.response && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-sm">Store Response</span>
                <span className="text-xs text-gray-500">
                  {formatDate(review.response.respondedAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{review.response.text}</p>
            </div>
          )}

          {/* Review Actions */}
          <div className="flex items-center space-x-4 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onHelpfulClick(review._id)}
              className={`text-sm ${
                currentUserId && review.helpful.includes(currentUserId)
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              <ThumbsUp size={14} className="mr-1" />
              Helpful ({review.helpful.length})
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
