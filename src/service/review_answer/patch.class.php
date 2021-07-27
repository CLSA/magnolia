<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\review_answer;
use cenozo\lib, cenozo\log, magnolia\util;

class patch extends \cenozo\service\patch
{
  /**
   * Extend parent method
   */
  public function finish()
  {
    parent::finish();

    // if we've set the answer to NULL then unset the recommendation
    $db_review_answer = $this->get_leaf_record();
    $db_review = $db_review_answer->get_review();
    if( is_null( $db_review_answer->answer ) && !is_null( $db_review->recommendation_type_id ) )
    {
      $db_review->recommendation_type_id = NULL;
      $db_review->save();
    }
  }
}
