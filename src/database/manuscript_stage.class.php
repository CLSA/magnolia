<?php
/**
 * manuscript_stage.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * manuscript_stage: record
 */
class manuscript_stage extends \cenozo\database\record
{
  /**
   * Determines whether the stage is complete and may proceed to the next stage-type
   */
  public function check_if_complete()
  {
    $manuscript_stage_type_class_name = lib::get_class_name( 'database\manuscript_stage_type' );

    $db_stage_type = $this->get_manuscript_stage_type();
    $review_list = $this->get_manuscript_review_object_list();

    if( 'Decision Made' == $db_stage_type->name )
    {
      // make sure that there is a recent notice (test against the datetime of the last stage)
      $stage_mod = lib::create( 'database\modifier' );
      $stage_mod->order_desc( 'datetime' );
      $stage_mod->limit( 1 );
      $stage_sel = lib::create( 'database\select' );
      $stage_sel->add_column( 'datetime' );

      $db_manuscript = $this->get_manuscript();
      $last_stage = current( $db_manuscript->get_manuscript_stage_list( $stage_sel, $stage_mod ) );

      $notice_mod = lib::create( 'database\modifier' );
      $notice_mod->where( 'datetime', '>', $last_stage['datetime'] );
      if( 0 == $db_manuscript->get_manuscript_notice_count( $notice_mod ) )
        return 'A new notice outlining the decision must be created before proceeding to the next stage.';
    }
    else
    {
      // make sure all reviews associated with this stage are complete
      foreach( $review_list as $db_review )
      {
        if( is_null( $db_review->manuscript_recommendation_type_id ) )
        {
          return sprintf(
            'The recommendation for the %s Review must be chosen before proceeding to the next stage.',
            $db_review->get_manuscript_review_type()->name
          );
        }
      }
    }

    return true;
  }

  /**
   * Convenience method for getting this stage's review list as objects
   */
  public function get_review_object_list()
  {
    return $this->get_manuscript_stage_type()->get_manuscript_review_object_list( $this->manuscript_id );
  }
}
