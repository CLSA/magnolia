<?php
/**
 * reqn.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * reqn: record
 */
class reqn extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    // track if this is a new reqn
    $is_new = is_null( $this->id );

    // make sure the deadline is appropriate
    $this->assert_deadline();

    parent::save();

    // if we're changing the ethics_filename to null then delete the ethics_letter file
    if( is_null( $this->ethics_filename ) )
    {
      $filename = sprintf( '%s/%s', ETHICS_LETTER_PATH, $this->id );
      if( file_exists( $filename ) ) unlink( $filename );
    }

    // if we're changing the agreement_filename to null then delete the agreement_letter file
    if( is_null( $this->agreement_filename ) )
    {
      $filename = sprintf( '%s/%s', AGREEMENT_LETTER_PATH, $this->id );
      if( file_exists( $filename ) ) unlink( $filename );
    }

    // if this is a new reqn then assign it to the first stage
    if( $is_new ) $this->proceed_to_next_stage();
  }

  /**
   * Override the parent method
   * 
   * This is done so that we can fill in the cohort columns which are part of the reqn_has_data_option table
   */
  public function add_data_option( $ids, $db_cohort )
  {
    // if ids is not an array then create a single-element array with it
    if( !is_array( $ids ) ) $ids = array( $ids );

    $values = '';
    $first = true;
    foreach( $ids as $id )
    {
      if( !$first ) $values .= ', ';
      $values .= sprintf(
        '(%s%s, %s, 1 )',
        $this->write_timestamps ? 'NULL, ' : '',
        static::db()->format_string( $this->id ),
        static::db()->format_string( $id )
      );
      $first = false;
    }

    static::db()->execute( sprintf(
      'INSERT INTO reqn_has_data_option (%sreqn_id, data_option_id, %s) '."\n".
      'VALUES %s'."\n".
      'ON DUPLICATE KEY UPDATE %s = 1',
      $this->write_timestamps ? 'create_timestamp, ' : '',
      $db_cohort->name,
      $values,
      $db_cohort->name
    ) );
  }

  /**
   * Override the parent method
   */
  public function remove_data_option( $ids, $db_cohort )
  {
    // if ids is not an array then create a single-element array with it
    if( !is_array( $ids ) ) $ids = array( $ids );

    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn_id', '=', $this->id );
    $modifier->where( 'data_option_id', 'IN', $ids );

    static::db()->execute(
      sprintf(
        'UPDATE reqn_has_data_option '."\n".
        'SET %s = 0'."\n".
        '%s',
        $db_cohort->name,
        $modifier->get_sql()
      )
    );

    // delete any row which may now have all cohorts = 0
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'comprehensive', '=', false );
    $modifier->where( 'tracking', '=', false );

    static::db()->execute( sprintf(
      'DELETE FROM reqn_has_data_option %s',
      $modifier->get_sql()
    ) );
  }

  /**
   * Check the reqn's deadline and change it to the next available deadline if needed
   * NOTE: This method will change the deadline_id column but not save the record
   * @access public
   */
  public function assert_deadline()
  {
    $deadline_class_name = lib::get_class_name( 'database\deadline' );

    $db_deadline = NULL;
    $change_deadline = false;
    if( is_null( $this->deadline_id ) )
    { // no deadline found
      $db_deadline = $deadline_class_name::get_next();
      $change_deadline = true;
    }
    else
    {
      $db_current_stage_type = $this->get_current_stage_type();
      if( is_null( $db_current_stage_type ) || 1 == $db_current_stage_type->rank )
      {
        if( 0 < $this->get_deadline()->date->diff( util::get_datetime_object() )->days )
        { // deadline has expired, get the next one
          $db_deadline = $deadline_class_name::get_next();
          $change_deadline = true;
        }
      }
    }

    if( $change_deadline )
    {
      if( is_null( $db_deadline ) )
        throw lib::create( 'exception\runtime',
          'Cannot proceed since there are no future deadlines defined.',
          __METHOD__ );
      $this->deadline_id = $db_deadline->id;
    }
  }

  /**
   * Returns the reqns current stage
   * @return database\stage
   * @access public
   */
  public function get_current_stage()
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'stage' );
    $select->add_column( 'id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn_id', '=', $this->id );
    $modifier->where( 'datetime', '=', NULL );

    $stage_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $stage_id ? lib::create( 'database\stage', $stage_id ) : NULL;
  }

  /**
   * Returns the reqn's current stage type
   * @return database\stage_type
   * @access public
   */
  public function get_current_stage_type()
  {
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'stage' );
    $select->add_column( 'stage_type_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn_id', '=', $this->id );
    $modifier->where( 'datetime', '=', NULL );

    $stage_type_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $stage_type_id ? lib::create( 'database\stage_type', $stage_type_id ) : NULL;
  }

  /**
   * Returns the reqn's next stage type (NULL if there is no valid next stage type)
   * @return database\stage_type
   * @access public
   */
  public function get_next_stage_type()
  {
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );

    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $db_current_stage_type = $this->get_current_stage_type();
    $db_next_stage_type = NULL;
    if( is_null( $db_current_stage_type ) )
    {
      $db_next_stage_type = $stage_type_class_name::get_unique_record( 'rank', 1 );
    }
    else
    {
      $db_stage = $this->get_current_stage();
      $stage_type_list = $db_current_stage_type->get_next_possible_stage_type_object_list();
      if( 1 == count( $stage_type_list ) )
      {
        $db_next_stage_type = current( $stage_type_list );
      }
      else if( 1 < count( $stage_type_list ) )
      {
        if( 'DSAC Selection' == $db_current_stage_type->name )
        {
          // the DSAC Selection stage type is special, if it is complete then the next stage is DSAC Review
          foreach( $stage_type_list as $db_stage_type )
          {
            if( 'DSAC Review' == $db_stage_type->name )
            {
              $db_next_stage_type = $db_stage_type;
              break;
            }
          }
        }
        else if( 'DSAC Review' == $db_current_stage_type->name )
        {
          $db_review = current( $db_stage->get_review_object_list() );
          if( $db_review )
          {
            if( 'Approved' == $db_review->recommendation )
            {
              foreach( $stage_type_list as $db_stage_type )
              {
                if( 'Decision Made' == $db_stage_type->name )
                {
                  $db_next_stage_type = $db_stage_type;
                  break;
                }
              }
            }
            else if( !is_null( $db_review->recommendation ) )
            {
              foreach( $stage_type_list as $db_stage_type )
              {
                if( 'SMT Decision' == $db_stage_type->name )
                {
                  $db_next_stage_type = $db_stage_type;
                  break;
                }
              }
            }
          }
        }
        else if( 'SMT Decision' == $db_current_stage_type->name )
        {
          $db_review = current( $db_stage->get_review_object_list() );
          if( $db_review )
          {
            if( 'Approved' == $db_review->recommendation || 'Not Approved' == $db_review->recommendation )
            {
              foreach( $stage_type_list as $db_stage_type )
              {
                if( 'Decision Made' == $db_stage_type->name )
                {
                  $db_next_stage_type = $db_stage_type;
                  break;
                }
              }
            }
            else if( 'Revise' == $db_review->recommendation )
            {
              foreach( $stage_type_list as $db_stage_type )
              {
                if( 'Revision Required' == $db_stage_type->name )
                {
                  $db_next_stage_type = $db_stage_type;
                  break;
                }
              }
            }
          }
        }
        else if( 'Decision Made' == $db_current_stage_type->name )
        {
          // the decision for this reqn depends on one of several possible reviews
          $review_sel = lib::create( 'database\select' );
          $review_sel->add_table_column( 'review_type', 'name' );
          $review_sel->add_column( 'recommendation' );
          $review_mod = lib::create( 'database\modifier' );
          $review_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
          $review_list = array();
          foreach( $this->get_review_list( $review_sel, $review_mod ) as $review )
            $review_list[$review['name']] = $review['recommendation'];

          $recommendation = NULL;
          // if there is a second SMT review then use that decision
          if( array_key_exists( 'Second SMT', $review_list ) ) $recommendation = $review_list['Second SMT'];
          // if there is a first SMT review then use that decision
          else if( array_key_exists( 'SMT', $review_list ) ) $recommendation = $review_list['SMT'];
          // if the chair approved their review then approve
          else if( array_key_exists( 'Chair', $review_list ) && 'Approved' == $review_list['Chair'] ) $recommendation = 'Approved';
          // if there is no chair review then do not approve (rejected before DSAC review)
          else if( !array_key_exists( 'Chair', $review_list ) ) $recommendation = 'Not Approved';

          if( !is_null( $recommendation ) )
          {
            foreach( $stage_type_list as $db_stage_type )
            {
              if( ( 'Approved' == $recommendation && 'Agreement' == $db_stage_type->name ) ||
                  ( 'Not Approved' == $recommendation && 'Not Approved' == $db_stage_type->name ) )
              {
                $db_next_stage_type = $db_stage_type;
                break;
              }
            }
          }
        }
      }
    }

    return $db_next_stage_type;
  }

  /**
   * Proceeds to the reqn to the next stage
   * 
   * The next stage is based on the current stage as well as the reqn's reviews
   * @access public
   */
  public function proceed_to_next_stage( $stage_type = NULL )
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to add stage to reqn with no primary key.' );
      return;
    }

    $review_class_name = lib::get_class_name( 'database\review' );
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );
    $db_user = lib::create( 'business\session' )->get_user();
    $db_current_stage = $this->get_current_stage();
    $db_current_stage_type = is_null( $db_current_stage ) ? NULL : $db_current_stage->get_stage_type();

    $db_next_stage_type = NULL;
    if( is_null( $stage_type ) )
    {
      $db_next_stage_type = $this->get_next_stage_type();
      if( is_null( $db_next_stage_type ) )
        throw lib::create( 'exception\runtime',
          'Unable to proceed to next stage since there is currently no valid stage type available.', __METHOD__ );
    }
    else if( is_object( $stage_type ) )
    {
      if( is_a( $stage_type, lib::get_class_name( 'database\stage_type' ) ) ) $db_next_stage_type = $stage_type;
    }
    else if( is_integer( $stage_type ) || ( is_string( $stage_type ) && util::string_matches_int( $stage_type ) ) )
    {
      $db_next_stage_type = $stage_type_class_name::get_unique_record( 'rank', $stage_type );
    }
    else if( is_string( $stage_type ) )
    {
      $db_next_stage_type = $stage_type_class_name::get_unique_record( 'name', $stage_type );
    }

    if( is_null( $db_next_stage_type ) )
      throw lib::create( 'exception\argument', 'stage_type', $stage_type, __METHOD__ );

    // Note: there is a special circumstanse where a reqn is being rejected during the DSAC selection stage (make note here)
    $reject_selection = !is_null( $db_current_stage_type ) &&
                        'DSAC Selection' == $db_current_stage_type->name &&
                        'Decision Made' == $db_next_stage_type->name;

    // make sure the stage type is appropriate
    if( is_null( $db_current_stage_type ) )
    {
      // we can only add the first stage when the reqn currently has no stages
      if( 1 != $db_next_stage_type->rank )
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to add stage "%s" but reqn has no existing stage.', $db_next_stage_type->name ),
          __METHOD__ );
    }
    else
    {
      // make sure there the next stage comes after the current stage
      if( !$db_next_stage_type->comes_after( $db_current_stage_type ) )
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to add stage "%s" which does not come after current stage "%s".',
                   $db_next_stage_type->name,
                   $db_current_stage_type->name ),
          __METHOD__ );

      // determine whether we can safely proceed to the next stage (ignoring if the DSAC selection stage has been rejected)
      if( !$reject_selection )
      {
        $result = $db_current_stage->check_if_complete();
        if( true !== $result ) throw lib::create( 'exception\notice', $result, __METHOD__ );
      }
    }

    // save the user who completed the current stage
    if( !is_null( $db_current_stage ) )
    {
      $db_current_stage->user_id = $db_user->id;
      $db_current_stage->datetime = util::get_datetime_object();
      $db_current_stage->save();
    }

    // create the new stage
    $db_next_stage = lib::create( 'database\stage' );
    $db_next_stage->reqn_id = $this->id;
    $db_next_stage->stage_type_id = $db_next_stage_type->id;
    $db_next_stage->save();

    // if we have just entered the admin review stage then set the identifier
    if( 'Admin Review' == $db_next_stage_type->name )
    {
      $base = $this->get_deadline()->date->format( 'ym' );
      $this->identifier = $this->get_deadline()->get_next_identifier();
      $this->save();
    }

    // manage any reviews associated with the current stage
    if( !is_null( $db_current_stage_type ) )
    {
      foreach( $db_current_stage_type->get_review_object_list( $this ) as $db_review )
      {
        if( $reject_selection )
        {
          // remove all reviews
          $db_review->delete();
        }
        else
        {
          // update the current stage's review's reviewer with the current user if it isn't already set
          if( is_null( $db_review->user_id ) )
          {
            $db_review->user_id = $db_user->id;
            $db_review->save();
          }
        }
      }
    }

    // if we have just entered the final report stage then create the final report
    if( 'Admin Review' == $db_next_stage_type->name )
    {
      $base = $this->get_deadline()->date->format( 'ym' );
      $this->identifier = $this->get_deadline()->get_next_identifier();
      $this->save();
    }
  }

  /**
   * Generates a PDF form version of the reqn (overwritting the previous version)
   * 
   * @access public
   */
  public function generate_pdf_form()
  {
    $pdf_form_type_class_name = lib::get_class_name( 'database\pdf_form_type' );

    // get the data application
    $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Data Application' );
    $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF form since there is no active Data Application PDF form.', __METHOD__ );

    $pdf_writer = lib::create( 'business\pdf_writer' );
    $pdf_writer->set_template( sprintf( '%s/%d.pdf', PDF_FORM_PATH, $db_pdf_form->id ) );

    $data = array( 'identifier' => $this->identifier );

    if( !is_null( $this->applicant_name ) ) $data['applicant_name'] = $this->applicant_name;
    if( !is_null( $this->applicant_position ) ) $data['applicant_position'] = $this->applicant_position;
    if( !is_null( $this->applicant_affiliation ) ) $data['applicant_affiliation'] = $this->applicant_affiliation;
    if( !is_null( $this->applicant_address ) ) $data['applicant_address'] = $this->applicant_address;
    if( !is_null( $this->applicant_phone ) ) $data['applicant_phone'] = $this->applicant_phone;
    if( !is_null( $this->applicant_email ) ) $data['applicant_email'] = $this->applicant_email;
    if( !is_null( $this->graduate_name ) ) $data['graduate_name'] = $this->graduate_name;
    if( !is_null( $this->graduate_program ) ) $data['graduate_program'] = $this->graduate_program;
    if( !is_null( $this->graduate_institution ) ) $data['graduate_institution'] = $this->graduate_institution;
    if( !is_null( $this->graduate_address ) ) $data['graduate_address'] = $this->graduate_address;
    if( !is_null( $this->graduate_phone ) ) $data['graduate_phone'] = $this->graduate_phone;
    if( !is_null( $this->graduate_email ) ) $data['graduate_email'] = $this->graduate_email;
    if( !is_null( $this->start_date ) ) $data['start_date'] = $this->start_date->format( 'Y-m-d' );
    if( !is_null( $this->duration ) ) $data['duration'] = $this->duration;
    if( !is_null( $this->title ) ) $data['title'] = $this->title;
    if( !is_null( $this->keywords ) ) $data['keywords'] = $this->keywords;
    if( !is_null( $this->lay_summary ) ) $data['lay_summary'] = $this->lay_summary;
    $data['word_count'] = is_null( $this->lay_summary ) ? 0 : count( explode( ' ', $this->lay_summary ) );
    if( !is_null( $this->background ) ) $data['background'] = $this->background;
    if( !is_null( $this->objectives ) ) $data['objectives'] = $this->objectives;
    if( !is_null( $this->methodology ) ) $data['methodology'] = $this->methodology;
    if( !is_null( $this->analysis ) ) $data['analysis'] = $this->analysis;

    if( !is_null( $this->funding ) )
    {
      if( 'yes' == $this->funding ) $data['funding_yes'] = 'Yes';
      else if( 'no' == $this->funding ) $data['funding_no'] = 'Yes';
      else if( 'requested' == $this->funding ) $data['funding_requested'] = 'Yes';
    }
    if( !is_null( $this->funding_agency ) ) $data['funding_agency'] = $this->funding_agency;
    if( !is_null( $this->grant_number ) ) $data['grant_number'] = $this->grant_number;
    if( !is_null( $this->ethics ) ) $data['ethics'] = $this->ethics ? 'yes' : 'no';
    if( !is_null( $this->ethics_date ) ) $data['ethics_date'] = $this->ethics_date->format( 'Y-m-d' );
    if( !is_null( $this->ethics_filename ) ) $data['ethics_filename'] = $this->ethics_filename;
    if( !is_null( $this->waiver ) )
    {
      if( 'graduate' == $this->waiver ) $data['waiver_graduate'] = 'Yes';
      else if( 'postdoc' == $this->waiver ) $data['waiver_postdoc'] = 'Yes';
    }
    if( !is_null( $this->applicant_name ) ) $data['signature_applicant_name'] = $this->applicant_name;

    foreach( $this->get_coapplicant_list() as $index => $coapplicant )
    {
      $data[sprintf( 'coapplicant%d_name', $index+1 )] = $coapplicant['name'];
      $data[sprintf( 'coapplicant%d_position', $index+1 )] =
        sprintf( "%s\n%s\n%s", $coapplicant['position'], $coapplicant['affiliation'], $coapplicant['email'] );
      $data[sprintf( 'coapplicant%d_role', $index+1 )] = $coapplicant['role'];
      $data[sprintf( 'coapplicant%d_%s', $index+1, $coapplicant['access'] ? 'yes' : 'no' )] = 'Yes';
    }

    $reference_list = array();
    $reference_sel = lib::create( 'database\select' );
    $reference_sel->add_column( 'rank' );
    $reference_sel->add_column( 'reference' );
    $reference_mod = lib::create( 'database\modifier' );
    $reference_mod->order( 'rank' );
    foreach( $this->get_reference_list( $reference_sel, $reference_mod ) as $index => $reference )
      $reference_list[] = sprintf( '%s.  %s', $reference['rank'], $reference['reference'] );
    $data['references'] = implode( "\n", $reference_list );

    $pdf_writer->fill_form( $data );
    $filename = sprintf( '%s/%s.pdf', REQN_PATH, $this->id );
    if( !$pdf_writer->save( $filename ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $filename,
          $this->identifier,
          "\n".$pdf_writer->get_error()
        ),
        __METHOD__
      );
    }
  }

  /**
   * Provides a new temporary identifier which doesn't already exist
   * 
   * @access public
   */
  public static function get_temporary_identifier()
  {
    $count = 0;
    $modifier = NULL;
    do
    {
      // guard against an infinite loop
      if( $count++ > 1000 ) throw lib::create( 'exception\runtime', 'Unable to create a new temporary identifier.', __METHOD__ );

      // pick a random number
      $identifier = 'T'.rand( 10000, 99999 );

      // see if it is already in use
      $modifier = lib::create( 'database\modifier' );
      $modifier->where( 'identifier', '=', $identifier );
    } while( static::count( $modifier ) );

    return $identifier;
  }
}
